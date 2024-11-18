import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then(m => m.SplashPageModule)
  },
  {
    path: 'cuenta-admin',
    loadChildren: () => import('./pages/admin/cuenta-admin/cuenta-admin.module').then(m => m.CuentaAdminPageModule)
  },
  {
    path: 'modificar-torneo',
    loadChildren: () => import('./pages/admin/TorneoAdmin/modificar-torneo/modificar-torneo.module').then(m => m.ModificarTorneoPageModule)
  },
  {
    path: 'detalles-torneo/:id',
    loadChildren: () => import('./pages/admin/TorneoAdmin/detalles-torneo/detalles-torneo.module').then(m => m.DetallesTorneoPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then(m => m.InicioPageModule)
  },
  {
    path: 'cuenta',
    loadChildren: () => import('./pages/Usuario/cuenta/cuenta.module').then(m => m.CuentaPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/Usuario/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/Usuario/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'nuevo-torneo',
    loadChildren: () => import('./pages/admin/TorneoAdmin/nuevo-torneo/nuevo-torneo.module').then(m => m.NuevoTorneoPageModule)
  },
  {
    path: 'detalle-juego/:id',
    loadChildren: () => import('./pages/Usuario/detalle-juego/detalle-juego.module').then(m => m.DetalleJuegoPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/Usuario/registro/registro.module').then(m => m.RegistroPageModule)
  },
  {
    path: 'iniciar-sesion',
    loadChildren: () => import('./pages/Usuario/iniciar-sesion/iniciar-sesion.module').then(m => m.IniciarSesionPageModule)
  },
  {
    path: 'detalle-inscripcion',
    loadChildren: () => import('./pages/Usuario/detalle-inscripcion/detalle-inscripcion.module').then(m => m.DetalleInscripcionPageModule)
  },
  {
    path: 'torneos',
    loadChildren: () => import('./pages/Usuario/torneos/torneos.module').then(m => m.TorneosPageModule)
  },
  {
    path: 'edicion-perfil',
    loadChildren: () => import('./pages/Usuario/edicion-perfil/edicion-perfil.module').then(m => m.EdicionPerfilPageModule)
  },
  {
    path: 'vista-torneo',
    loadChildren: () => import('./pages/Usuario/vista-torneo/vista-torneo.module').then(m => m.VistaTorneoPageModule)
  },

  {
    path: 'cambiar-contra',
    loadChildren: () => import('./pages/Usuario/cambiar-contra/cambiar-contra.module').then( m => m.CambiarContraPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundPageModule)
  },
  {
    path: 'progreso',
    loadChildren: () => import('./pages/Usuario/progreso/progreso.module').then( m => m.ProgresoPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
