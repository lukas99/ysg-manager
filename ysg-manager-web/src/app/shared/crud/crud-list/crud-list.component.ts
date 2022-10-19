import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ColDef, GridApi, RowClassParams } from 'ag-grid-community';
import { switchMap } from 'rxjs/operators';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData
} from '../../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ShortcutService } from '../../../core/services/shortcut.service';

/**
 * The options to pass to the CrudListComponent.
 */
export interface CrudListOptions {
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
 * Provides the CRUD operations for the CRUD list and detail components.
 */
export interface CrudService {
  getItems(): Observable<any[]>;
  createItem(item: any): Observable<any>;
  updateItem(item: any): Observable<any>;
  deleteItem(item: any): Observable<any>;
  getItemTitle(item: any): string;
  getSelectedItem(): Observable<any>;
  setSelectedItem(item: any): void;
  removeSelectedItem(): void;
}

/**
 * Generic implementation of a CRUD list table with agGrid.
 */
@Component({
  selector: 'ysg-crud-list',
  templateUrl: 'crud-list.component.html',
  styleUrls: ['crud-list.component.css']
})
export class CrudListComponent implements OnInit {
  @Input() options!: CrudListOptions;
  @Input() hasMoreActions = false;

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

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private translateService: TranslateService,
    private shortcutService: ShortcutService
  ) {}

  ngOnInit(): void {
    this.items$ = this.refreshToken$.pipe(
      switchMap(() => this.options.crudService.getItems())
    );
    this.registerShortcuts();
  }

  private registerShortcuts(): void {
    this.shortcutService.add('plus', () => this.createItem());
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
      const selectedItem = selectedNodes[0].data;
      this.openDeleteConfirmationDialog(selectedItem);
    }
  }

  openDeleteConfirmationDialog(itemToDelete: any): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: <ConfirmationDialogData>{
        title: 'DELETE_CONFIRMATION_DIALOG_TITLE',
        text: this.translateService.instant('DELETE_CONFIRMATION_DIALOG_TEXT', {
          itemName: this.options.crudService.getItemTitle(itemToDelete)
        }),
        cancelButtonText: 'NO',
        confirmButtonText: 'YES'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.delete(itemToDelete);
      }
    });
  }

  delete(itemToDelete: any) {
    this.options.crudService
      .deleteItem(itemToDelete)
      .subscribe(() => this.refreshToken$.next(undefined));
  }

  onRowSelected($event: any) {
    this.isItemSelected = this.gridApi.getSelectedNodes().length > 0;
  }

  getRowStyle(params: RowClassParams) {
    if (params.data.isCached === true) {
      return { background: 'lightyellow' };
    }
  }
}
