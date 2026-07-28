import { useState } from 'react';
import './App.css';
import { PessoasSection } from './components/PessoasSection';
import { TransacoesSection } from './components/TransacoesSection';
import { TotaisSection } from './components/TotaisSection';

type Aba = 'pessoas' | 'transacoes' | 'totais';

// estrutura principal com abas
function App() {
  const [aba, setAba] = useState<Aba>('pessoas');
  const [navbarOpen, setNavbarOpen] = useState(true);

  // abre ou fecha a navbar
  async function handleAbrirNavbar(bool: boolean) {
    setNavbarOpen(bool);
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <h1 className="app-header__title">Controle de Gastos Residenciais <span  className={`app-header__toggle ${navbarOpen ? "open" : ""}`} onClick={() => handleAbrirNavbar(!navbarOpen)}>⌄</span></h1>
          {navbarOpen && (
            <nav className="tabs">
            <button
              className={`tab ${aba === 'pessoas' ? 'tab--active' : ''}`}
              onClick={() => setAba('pessoas')}
            >
              Pessoas
            </button>
            <button
              className={`tab ${aba === 'transacoes' ? 'tab--active' : ''}`}
              onClick={() => setAba('transacoes')}
            >
              Transações
            </button>
            <button
              className={`tab ${aba === 'totais' ? 'tab--active' : ''}`}
              onClick={() => setAba('totais')}
            >
              Totais
            </button>
          </nav>
          )}
          
        </div>
      </header>

      <main className="app-content">
        {aba === 'pessoas' && <PessoasSection />}
        {aba === 'transacoes' && <TransacoesSection />}
        {aba === 'totais' && <TotaisSection />}
      </main>
    </div>
  );
}

export default App;
