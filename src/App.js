import './App.css';
import StyleGlobal from './components/StyleGlobal';
import AppRouter from './routes/Router';


function App() {
  return (

    <StyleGlobal>
      <div className='App'>
        <AppRouter />
      </div>
    </StyleGlobal>
  );
}

export default App;
