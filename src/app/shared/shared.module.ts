import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BarRatingModule } from "ngx-bar-rating";
import { NgImageSliderModule } from 'ng-image-slider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTabsModule} from '@angular/material/tabs';
import {MatRadioModule} from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatTreeModule } from '@angular/material/tree';

import { NgxSummernoteModule } from 'ngx-summernote';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { SafeHtmlPipePipe } from '../_helpers/safe-html-pipe.pipe';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { MatChipsModule } from '@angular/material/chips';



// import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  imports:[
    CommonModule,
    RouterModule,
    NgbModule,
    
  ],
  declarations:[SafeHtmlPipePipe, SidebarComponent, NavbarComponent],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatAutocompleteModule,
    BarRatingModule,
    NgImageSliderModule,
    MatCardModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatNativeDateModule,
    SlickCarouselModule,
    NgbModule,
    MatTabsModule,
    MatRadioModule,
    MatIconModule,
    MatPaginatorModule,
    MatExpansionModule,
    SafeHtmlPipePipe,
    MatListModule,
    NgxSummernoteModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatChipsModule,
    SidebarComponent,
    NavbarComponent,
    MatTreeModule,
    // PdfViewerModule
  ],
  providers:[]
})
export class SharedModule { }
