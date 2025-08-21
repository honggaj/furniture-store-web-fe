import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  isSidebarOpen = true;
  activeItem: string = 'Default';
  menuSections = [
    {
      title: 'Dashboard',
      items: [
        { label: 'Default', icon: 'fas fa-globe-americas', route: '/dashboard' }
      ]
    },
  {
    title: 'Quản lý',
    items: [
      { label: 'Người dùng', icon: 'fas fa-undo-alt', route: '/user' },
      { label: 'Sản phẩm', icon: 'fas fa-list-alt', route: '/products' }
    ]
  },
    {
      title: 'UI Components',
      items: [
        { label: 'Typography', icon: 'fas fa-font', route: '/typography' },
        { label: 'Colors', icon: 'fas fa-palette', route: '/colors' },
        { label: 'Ant Icons', icon: 'fas fa-gem', route: '/icons' }
      ]
    },
    {
      title: 'Other',
      items: [
        { label: 'Sample Page', icon: 'fas fa-globe', route: '/sample' },
        { label: 'Document', icon: 'fas fa-question', route: '/docs' }
      ]
    },
    {
      title: 'Authentication',
      items: [
        { label: 'Login', icon: 'fas fa-undo-alt', route: '/login' },
        { label: 'Register', icon: 'fas fa-list-alt', route: '/register' }
      ]
    },
  ];


  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  setActive(item: string) {
    this.activeItem = item;
  }
}