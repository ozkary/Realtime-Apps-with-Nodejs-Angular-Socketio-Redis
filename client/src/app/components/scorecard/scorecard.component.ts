import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'scorecard',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.css']
})
export class ScorecardComponent implements OnChanges {
  @Input() title: string;
  @Input() values: number[];
  @Input() unit: string;
  @Input() bgClass: string;
  
  value: number = 0;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.values && this.values) {
      this.calculateHighestValue();
    }
  }

  private calculateHighestValue() {    
    this.value = (this.values?.length > 0) ? Math.max(...this.values) : 0;
  }
}
