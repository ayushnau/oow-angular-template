import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodItem, Variation } from '../../../interfaces/food.interface';

@Component({
  selector: 'app-variation-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './variation-selector.component.html'
})
export class VariationSelectorComponent implements OnInit {
  @Input() item!: FoodItem;
  @Input() selectedVariation: Variation | null = null;
  @Output() variationSelected = new EventEmitter<Variation>();
  
  uniqueVariations: Variation[] = [];

  ngOnInit() {
    this.initializeVariations();
  }

  private initializeVariations() {
    if (this.item?.variation) {
      this.uniqueVariations = Array.from(
        new Map(this.item.variation.map(item => [item.variationid, item])).values()
      );
      
      if (this.uniqueVariations.length > 0 && !this.selectedVariation) {
        this.onSelect(this.uniqueVariations[0]);
      }
    }
  }

  onSelect(variation: Variation) {
    this.selectedVariation = variation;
    this.variationSelected.emit(variation);
  }
} 