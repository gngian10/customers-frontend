import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly breakpointObserver = inject(BreakpointObserver);

  protected readonly title = signal('customers-frontend');

  protected readonly isMobile = toSignal(
    this.breakpointObserver.observe('(max-width: 768px)').pipe(map((state) => state.matches)),
    { initialValue: false }
  );

  protected readonly collapsed = signal(false);
  protected readonly mobileDrawerOpen = signal(false);

  protected readonly sidenavMode = computed<'over' | 'side'>(() =>
    this.isMobile() ? 'over' : 'side'
  );

  protected readonly sidenavOpened = computed(() =>
    this.isMobile() ? this.mobileDrawerOpen() : true
  );

  protected toggleSidenav(): void {
    if (this.isMobile()) {
      this.mobileDrawerOpen.update((open) => !open);
    } else {
      this.collapsed.update((value) => !value);
    }
  }

  protected onNavLinkClick(): void {
    if (this.isMobile()) {
      this.mobileDrawerOpen.set(false);
    }
  }

  protected onOpenedChange(opened: boolean): void {
    if (this.isMobile()) {
      this.mobileDrawerOpen.set(opened);
    }
  }
}
