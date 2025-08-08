document.addEventListener('DOMContentLoaded', () => {
    const data = {
      orquidea1: {
        title: 'Phalaenopsis amarilla con morado',
        desc: 'Es una Phalaenopsis de flores grandes y planas: pétalos de un amarillo intenso y un labelo (labio) fucsia-rosado, montada en un sustrato de corteza y con el tallo floral guiado por una varilla de soporte. En cultivo por injerto o multipartes (cuando se hacen “injertos de flor”), la planta receptora (o portainjerto) es la Phalaenopsis base que aporta las raíces y el sistema vascular; sobre ella se injerta (o se une) el “cultivar” con las flores (en este caso, la variedad amarilla-fucsia).'
     
    },
      orquidea2: {
        title: 'Orquidea Blanca',
        desc: 'Esta Phalaenopsis híbrida luce flores de pétalos anchos y simétricos, completamente blancos con un tenue matiz crema en el centro, que aportan una elegancia serena. Como donante dominante, su tallo floral injertado transmite al receptor tanto el color puro como la estructura característica de sus flores, asegurando que las nuevas floraciones repliquen fielmente su forma y tono.'
      },
      orquidea3: {
        title: 'Hija Hibrida Blaca con morado',
        desc: 'Esta Phalaenopsis híbrida heredó lo mejor de sus progenitores: presenta pétalos blancos de base perfectamente delineados por abundantes manchas y salpicaduras fucsia intenso que evocan la vibrante flor madre, junto con sutiles matices crema que recuerdan al patrón de la donante blanca. Sus flores, de tamaño mediano y forma redondeada, se disponen en dos espigas arqueadas, creando un dosel compacto y muy florífero. El centro (labelo) conserva una fusión de amarillo pálido y fucsia, aportando un contraste elegante y llamativo. En conjunto, esta «hija» combina refinamiento y explosión de color, ideal para destacar en cualquier colección.'
      },
      orquidea4: {
        title: 'Injerto',
        desc: 'En la fotografía se ve el punto de injerto donde los fragmentos cilíndricos de madera (el scion de la variedad hija) han sido tallados en cuña e insertados sobre el portainjerto. Para proteger y mantener la humedad en la unión, se colocó una pequeña “almohadilla” de fibra de coco y musgo, y se espolvoreó canela (antifúngico natural) a modo de sellante. Con el tiempo, en ese nudo comenzará a formarse el callo que fusionará ambos tejidos y permitirá que las flores del scion reciban savia del receptor.'
      }
    };
  
    // Si estamos en la galería, detectamos el click y navegamos
    if (!document.body.classList.contains('detail-page')) {
      document.querySelector('.gallery').addEventListener('click', e => {
        if (e.target.tagName === 'IMG') {
          const id = e.target.dataset.id;
          window.location.href = `detail.html?image=${id}`;
        }
      });
      return;
    }
  
    // Si estamos en detail.html, cargamos datos y poblamos la página
    const params = new URLSearchParams(window.location.search);
    const imgId = params.get('image');
    if (imgId && data[imgId]) {
      document.getElementById('detail-img').src = `${imgId}.jpg`;
      document.getElementById('detail-title').textContent = data[imgId].title;
      document.getElementById('detail-desc').textContent = data[imgId].desc;
    }
  
    // Botón volver
    document.getElementById('back-btn').addEventListener('click', () => {
      history.back();
    });
  });