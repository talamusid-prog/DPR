// Lazy loading components untuk optimasi performa
import { lazy } from 'react';

// Lazy load komponen yang tidak critical
export const LazyAdminPortfolio = lazy(() => import('@/pages/AdminPortfolio'));
export const LazyAdminGallery = lazy(() => import('@/pages/AdminGallery'));
export const LazyAdminAspirasi = lazy(() => import('@/pages/AdminAspirasi'));
export const LazyAdminKalenderPage = lazy(() => import('@/pages/AdminKalenderPage'));
export const LazyCreateArticle = lazy(() => import('@/pages/CreateArticle'));
export const LazyEditArticle = lazy(() => import('@/pages/EditArticle'));
export const LazyBlog = lazy(() => import('@/pages/Blog'));
export const LazyBlogDetail = lazy(() => import('@/components/BlogDetail'));
export const LazyDokumentasi = lazy(() => import('@/pages/Dokumentasi'));
export const LazyRegistration = lazy(() => import('@/pages/Registration'));
export const LazyAspirasiPage = lazy(() => import('@/pages/AspirasiPage'));
export const LazyKalenderPage = lazy(() => import('@/pages/KalenderPage'));
export const LazyProfilPage = lazy(() => import('@/pages/ProfilPage'));
export const LazyColorSettingsPage = lazy(() => import('@/pages/ColorSettingsPage'));

// Lazy load komponen UI yang besar
export const LazyCKEditor = lazy(() => import('@ckeditor/ckeditor5-react'));
export const LazyClassicEditor = lazy(() => import('@ckeditor/ckeditor5-build-classic'));
