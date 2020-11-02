import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { CrudListService } from '../../../core/services/crud-list.service';

/**
 * The options to pass to the CrudListComponent.
 */
export interface CrudListOptions {
  headers: CrudListHeader[];
  crudService: CrudService;
  /**
   * The url to the detail page.
   */
  routerDetailUrl: string;
}

/**
 * Represents a header column of the CRUD list.
 */
export interface CrudListHeader {
  key: string;
  title: string;
}

/**
 * Provides the CRUD operations for the CRUD list and detail components.
 */
export interface CrudService {
  getItems(): Observable<any[]>;
  createItem(item: any): Observable<any>;
  updateItem(item: any): Observable<any>;
  deleteItem(item: any): Observable<any>;
  getItemTitle(item: any): string;
}

/**
 * Generic implementation of a CRUD list table.
 */
@Component({
  selector: 'ysg-crud-list',
  templateUrl: 'crud-list.component.html',
  styleUrls: ['crud-list.component.css']
})
export class CrudListComponent implements OnInit {
  @Input() options!: CrudListOptions;

  displayedColumns: string[] = [];
  refreshToken$ = new BehaviorSubject(undefined);
  items$: Observable<any[]> = EMPTY;

  constructor(
    private crudListService: CrudListService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setDisplayedColumns();
    this.items$ = this.refreshToken$.pipe(
      switchMap(() => this.options.crudService.getItems())
    );
  }

  private setDisplayedColumns() {
    this.options.headers.forEach((header) =>
      this.displayedColumns.push(header.key)
    );
    this.displayedColumns.push('actions');
  }

  edit(element: any) {
    this.crudListService.setSelectedItem(element);
    this.navigateToDetailView();
  }

  create() {
    this.crudListService.setEmptyItem();
    this.router.navigateByUrl(this.options.routerDetailUrl);
  }

  private navigateToDetailView() {
    this.router.navigateByUrl(this.options.routerDetailUrl);
  }

  delete(element: any) {
    this.options.crudService
      .deleteItem(element)
      .subscribe(() => this.refreshToken$.next(undefined));
  }
}
