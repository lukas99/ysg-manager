import { Component, OnInit } from '@angular/core';
import { ResultDetailModel } from './result-detail.model';

@Component({
  selector: 'ysg-result-detail-for-points',
  templateUrl: './result-detail-for-points.component.html',
  styleUrls: ['./result-detail-for-points.component.css']
})
export class ResultDetailForPointsComponent
  extends ResultDetailModel
  implements OnInit
{
  resultExists(): boolean {
    // all values of selected item are undefined, we use points here for testing
    return this.skillResultsService.getSelectedItemValue().points;
  }
}
