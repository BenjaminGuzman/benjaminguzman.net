import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {environment} from "../../environments/environment";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("headerAnimation", [
      state("open", style({
        top: "0"
      })),
      state("closed", style({
        top: "-3.5rem"
      })),
      transition("open => closed", [
        animate("400ms ease-in")
      ]),
      transition("closed => open", [
        animate("400ms ease-out")
      ])
    ]),
    trigger("menuAnimation", [
      state("open", style({
        height: "100%",
        display: "block"
      })),
      state("closed", style({
        height: "0",
        display: "none"
      })),
      transition("open => closed", [
        animate("300ms ease-in")
      ]),
      transition("closed => open", [
        style({display: "block"}),
        animate("300ms ease-out")
      ])
    ])
  ]
})
export class NavComponent implements OnInit {
  /**
   * Indicates light or dark mode
   * It is a class for the icon shown in the nav
   */
  public nextColorModeIcon: 'light_mode' | 'dark_mode' = 'dark_mode';

  /**
   * Indicates if the menu for small devices is open or closed
   * It is a class for the icon shown in the nav
   */
  public nextMenuStateIcon: 'menu' | 'close' = 'menu';

  /**
   * Holds the name of the current state of the header animation
   */
  public headerAnimationState: 'open' | 'closed' = 'open';

  /**
   * Holds the name of the current state of the nav menu animation
   */
  public menuAnimationState: 'open' | 'closed' = 'closed';

  /**
   * Tells whether the nav for small screens is shown
   */
  public isNavShown: boolean = false;

  private lastScrollPos: number = 0;

  constructor(private changeDetectorRef: ChangeDetectorRef, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    this.toggleDarkMode();

    if (environment.useHeaderAnimation)
      window.onscroll = () => this.headerAnimation();
  }

  public headerAnimation() {
    const top = document.documentElement.scrollTop || document.body.scrollTop;

    if (top > this.lastScrollPos) // going down
      this.headerAnimationState = 'closed';
    else // going up
      this.headerAnimationState = 'open';

    this.lastScrollPos = top;
    this.changeDetectorRef.markForCheck();
  }

  public toggleDarkMode(): void {
    if (!isPlatformBrowser(this.platformId))
      return;

    if (this.nextColorModeIcon === 'dark_mode') {
      localStorage.theme = 'dark';
      this.nextColorModeIcon = 'light_mode';
    } else {
      localStorage.theme = 'light';
      this.nextColorModeIcon = 'dark_mode';
    }

    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches))
      document.documentElement.classList.add('dark');
    else
      document.documentElement.classList.remove('dark');
  }

  public toggleNavMenu() {
    if (this.isNavShown) {
      this.isNavShown = false;
      this.menuAnimationState = 'closed';
      this.nextMenuStateIcon = 'menu';
    } else {
      this.isNavShown = true;
      this.menuAnimationState = 'open';
      this.nextMenuStateIcon = 'close';
    }

    this.changeDetectorRef.markForCheck();
  }
}
