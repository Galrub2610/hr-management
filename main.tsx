import { 
  BrowserRouter,
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

// הוסף את התצורה הזו
const router = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
}); 