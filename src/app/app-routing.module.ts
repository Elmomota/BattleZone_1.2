import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'login-admin',
    loadChildren: () => import('./pages/admin/login-admin/login-admin.module').then( m => m.LoginAdminPageModule)
  },
  {
    path: 'cuenta-admin',
    loadChildren: () => import('./pages/admin/cuenta-admin/cuenta-admin.module').then( m => m.CuentaAdminPageModule)
  },
  {
    path: 'agregar-torneo',
    loadChildren: () => import('./pages/admin/TorneoAdmin/agregar-torneo/agregar-torneo.module').then( m => m.AgregarTorneoPageModule)
  },
  {
    path: 'modificar-torneo',
    loadChildren: () => import('./pages/admin/TorneoAdmin/modificar-torneo/modificar-torneo.module').then( m => m.ModificarTorneoPageModule)
  },
  {
    path: 'detalles-torneo/:id',
    loadChildren: () => import('./pages/admin/TorneoAdmin/detalles-torneo/detalles-torneo.module').then( m => m.DetallesTorneoPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'cuenta',
    loadChildren: () => import('./pages/Usuario/cuenta/cuenta.module').then( m => m.CuentaPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/Usuario/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/Usuario/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/Usuario/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/Usuario/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/not-found/not-found.module').then( m => m.NotFoundPageModule)
  },

 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
