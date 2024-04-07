import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MenuComponent } from '../../shared/menu/menu.component';

@NgModule({
  declarations: [HomeComponent, MenuComponent],
  imports: [CommonModule, HomeRoutingModule, MatSidenavModule],
})
export class HomeModule {}
