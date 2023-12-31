import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInOut, INavbarData } from './helper';
import { navbarData } from './nav.data';
import { AuthService } from '@bluebits/users';

interface SideNavToggle {
    screenWidth: number;
    collapsed: boolean;
}

@Component({
    selector: 'admin-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    animations: [
        fadeInOut,
        trigger('rotate', [
            transition(':enter', [
                animate('1000ms', keyframes([style({ transform: 'rotate(0deg)', offset: '0' }), style({ transform: 'rotate(2turn)', offset: '1' })]))
            ])
        ])
    ]
})
export class SidebarComponent implements OnInit {
    @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
    collapsed = false;
    screenWidth = 0;
    navData = navbarData;
    multiple = false;

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.screenWidth = window.innerWidth;
        if (this.screenWidth <= 768) {
            this.collapsed = false;
            this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
        }
    }

    constructor(public router: Router, private authService: AuthService) {}

    ngOnInit(): void {
        this.screenWidth = window.innerWidth;
    }

    toggleCollapse(): void {
        this.collapsed = !this.collapsed;
        this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }

    closeSidenav(): void {
        this.collapsed = false;
        this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }

    handleClick(item: INavbarData): void {
        this.shrinkItems(item);
        item.expanded = !item.expanded;
    }

    getActiveClass(data: INavbarData): string {
        return this.router.url.includes(data.routeLink) ? 'active' : '';
    }

    shrinkItems(item: INavbarData): void {
        if (!this.multiple) {
            for (const modelItem of this.navData) {
                if (item !== modelItem && modelItem.expanded) {
                    modelItem.expanded = false;
                }
            }
        }
    }
    logoutUser() {
        this.authService.logout();
    }
}
