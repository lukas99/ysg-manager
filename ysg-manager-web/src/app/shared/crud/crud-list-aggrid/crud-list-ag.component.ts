import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CrudService } from '../crud-list/crud-list.component';
import { ColDef, GridApi } from 'ag-grid-community';
import { switchMap } from 'rxjs/operators';

/**
 * The options to pass to the CrudListComponent.
 */
export interface CrudListOptionsAg {
  /**
   * The agGrid column definitions.
   */
  columnDefs: ColDef[];
  crudService: CrudService;
  /**
   * The url to the detail page.
   */
  routerDetailUrl: string;
}

/**
 * Generic implementation of a CRUD list table with agGrid.
 */
@Component({
  selector: 'ysg-crud-list-ag',
  templateUrl: 'crud-list-ag.component.html',
  styleUrls: ['crud-list-ag.component.css']
})
export class CrudListAgComponent implements OnInit {
  @Input() options!: CrudListOptionsAg;

  private gridApi!: GridApi;

  refreshToken$ = new BehaviorSubject(undefined);
  items$: Observable<any[]> = EMPTY;
  isItemSelected = false;

  defaultColDef: ColDef = {
    sortable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    resizable: true
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.items$ = this.refreshToken$.pipe(
      switchMap(() => this.options.crudService.getItems())
    );
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  editSelectedItem() {
    const selectedNodes = this.gridApi.getSelectedNodes();
    if (selectedNodes.length > 0) {
      this.edit(selectedNodes[0]);
    }
  }

  edit(node: any) {
    this.options.crudService.setSelectedItem(node.data);
    this.navigateToDetailView();
  }

  createItem() {
    this.options.crudService.removeSelectedItem();
    this.navigateToDetailView();
  }

  private navigateToDetailView() {
    this.router.navigateByUrl(this.options.routerDetailUrl);
  }

  deleteSelectedItem() {
    const selectedNodes = this.gridApi.getSelectedNodes();
    if (selectedNodes.length > 0) {
      this.delete(selectedNodes[0]);
    }
  }

  delete(node: any) {
    this.options.crudService
      .deleteItem(node.data)
      .subscribe(() => this.refreshToken$.next(undefined));
  }

  onRowSelected($event: any) {
    this.isItemSelected = this.gridApi.getSelectedNodes().length > 0;
  }
}
