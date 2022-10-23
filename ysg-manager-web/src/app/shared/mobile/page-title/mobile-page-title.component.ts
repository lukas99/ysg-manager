import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ysg-mobile-page-title',
  templateUrl: './mobile-page-title.component.html',
  styleUrls: ['./mobile-page-title.component.css']
})
export class MobilePageTitleComponent {
  @Input('backRoute') backRoute!: string;

  constructor(private router: Router) {}

  navigateBack() {
    this.router.navigateByUrl(this.backRoute);
  }
}
