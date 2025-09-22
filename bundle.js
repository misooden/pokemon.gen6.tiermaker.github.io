const { useState } = React;

function App() {
  // 初期ティア
  const [tiers, setTiers] = useState([
    { name: 'S', pokemons: [] },
    { name: 'A', pokemons: [] },
    { name: 'B', pokemons: [] },
  ]);

  // 初期ポケモンプール
  const [pool, setPool] = useState([
    { id: 1, name: 'ピカチュウ', img: 'images/pikachu.png' },
    { id: 2, name: 'フシギダネ', img: 'images/bulbasaur.png' },
    { id: 3, name: 'ヒトカゲ', img: 'images/charmander.png' },
    { id: 4, name: 'ゼニガメ', img: 'images/squirtle.png' },
  ]);

  // 新規ティア名
  const [newTierName, setNewTierName] = useState('');

  // ドラッグ中のポケモン
  const [dragging, setDragging] = useState(null);

  function onDragStart(pokemon, from) {
    setDragging({ pokemon, from });
  }

  function onDropTier(tierName) {
    if (!dragging) return;
    const { pokemon, from } = dragging;

    // 元の場所から削除
    if (from === 'pool') {
      setPool(pool.filter(p => p.id !== pokemon.id));
    } else {
      setTiers(tiers.map(t => {
        if (t.name === from) {
          return { ...t, pokemons: t.pokemons.filter(p => p.id !== pokemon.id) };
        }
        return t;
      }));
    }

    // 追加
    setTiers(tiers.map(t => {
      if (t.name === tierName) {
        return { ...t, pokemons: [...t.pokemons, pokemon] };
      }
      return t;
    }));

    setDragging(null);
  }

  function onDropPool() {
    if (!dragging) return;
    const { pokemon, from } = dragging;

    if (from !== 'pool') {
      setTiers(tiers.map(t => {
        if (t.name === from) {
          return { ...t, pokemons: t.pokemons.filter(p => p.id !== pokemon.id) };
        }
        return t;
      }));
      setPool([...pool, pokemon]);
    }

    setDragging(null);
  }

  // ティア追加
  function addTier() {
    if (newTierName.trim() === '') return;
    if (tiers.some(t => t.name === newTierName.trim())) {
      alert('同じ名前のティアが既にあります');
      return;
    }
    setTiers([...tiers, { name: newTierName.trim(), pokemons: [] }]);
    setNewTierName('');
  }

  // ティア削除
  function removeTier(name) {
    // ティア内ポケモンをプールに戻す
    const tierToRemove = tiers.find(t => t.name === name);
    if (tierToRemove) {
      setPool([...pool, ...tierToRemove.pokemons]);
    }
    // ティア削除
    setTiers(tiers.filter(t => t.name !== name));
  }

  // 画像として保存
  function saveAsImage() {
    const element = document.querySelector('.tier-container');
    html2canvas(element).then(canvas => {
      const link = document.createElement('a');
      link.download = 'tierlist.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  }

  return (
    <div>
      <div className=\"add-tier-container\" style={{ marginBottom: '1rem' }}>
        <input
          type=\"text\"
          value={newTierName}
          onChange={e => setNewTierName(e.target.value)}
          placeholder=\"新しいティア名\"
          style={{ padding: '0.5rem', marginRight: '0.5rem' }}
        />
        <button className=\"save\" onClick={addTier}>ティア追加</button>
      </div>

      <div className=\"tier-container\">
        {tiers.map(tier => (
          <div
            key={tier.name}
            className=\"tier-row\"
            onDragOver={e => e.preventDefault()}
            onDrop={() => onDropTier(tier.name)}
          >
            <div className=\"tier-label\">{tier.name}</div>
            <div className=\"tier-images\">
              {tier.pokemons.map(p => (
                <img
                  key={p.id}
                  src={p.img}
                  alt={p.name}
                  draggable
                  onDragStart={() => onDragStart(p, tier.name)}
                />
              ))}
            </div>
            <button
              onClick={() => removeTier(tier.name)}
              style={{
                marginLeft: 'auto',
                padding: '0.25rem 0.5rem',
                backgroundColor: '#e53e3e',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              削除
            </button>
          </div>
        ))}

        <div
          className=\"tier-row\"
          onDragOver={e => e.preventDefault()}
          onDrop={onDropPool}
        >
          <div className=\"tier-label\">プール</div>
          <div className=\"tier-images\">
            {pool.map(p => (
              <img
                key={p.id}
                src={p.img}
                alt={p.name}
                draggable
                onDragStart={() => onDragStart(p, 'pool')}
              />
            ))}
          </div>
        </div>
      </div>

      <div className=\"button-container\">
        <button className=\"save\" onClick={saveAsImage}>画像として保存</button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
