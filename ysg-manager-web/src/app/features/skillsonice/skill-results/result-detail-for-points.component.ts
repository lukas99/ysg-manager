import { Component } from '@angular/core';
import { ResultDetailModel } from './result-detail.model';

@Component({
  selector: 'ysg-result-detail-for-points',
  templateUrl: './result-detail-for-points.component.html',
  styleUrls: ['./result-detail-for-points.component.css'],
  standalone: false
})
export class ResultDetailForPointsComponent extends ResultDetailModel {}
