import {
  AfterContentInit,
  Component,
  Input,
  OnInit,
  TemplateRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EMPTY, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { CrudService } from '../crud-list-aggrid/crud-list-ag.component';

/**
 * The options for to pass to the CrudDetailComponent.
 */
export interface CrudDetailOptions {
  form: FormGroup;
  crudService: CrudService;
  /**
   * The url to the list overview page.
   */
  routerListUrl: string;
}

/**
 * Generic implementation of a CRUD detail view.
 */
@Component({
  selector: 'ysg-crud-detail',
  templateUrl: 'crud-detail.component.html',
  styleUrls: ['crud-detail.component.css']
})
export class CrudDetailComponent implements OnInit, AfterContentInit {
  @Input() options!: CrudDetailOptions;
  @Input() fieldsTemplate!: TemplateRef<any>;

  private title = '';
  form = new FormGroup({});
  item$: Observable<any> = EMPTY;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.item$ = this.options.crudService
      .getSelectedItem()
      .pipe(tap((item) => this.form.patchValue(item)));
  }

  ngAfterContentInit(): void {
    this.form = this.options.form;
  }

  getTitle(item: any): string {
    if (!this.title) {
      this.title = this.options.crudService.getItemTitle(item);
    }
    return this.title;
  }

  save() {
    if (this.isFormValid()) {
      const item: any = this.form.value;
      this.shouldUpdate(item) ? this.update(item) : this.create(item);
    }
  }

  private isFormValid() {
    return this.form.dirty && this.form.valid;
  }

  private shouldUpdate(item: any) {
    return item._links && item._links.self;
  }

  private update(item: any) {
    this.options.crudService
      .updateItem(item)
      .subscribe(() => this.navigateToOverview());
  }

  private create(item: any) {
    this.options.crudService
      .createItem(item)
      .subscribe(() => this.navigateToOverview());
  }

  cancel() {
    this.navigateToOverview();
  }

  private navigateToOverview() {
    this.router.navigateByUrl(this.options.routerListUrl);
  }
}
