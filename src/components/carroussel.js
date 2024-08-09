import React from 'react';

const CarouselWrapper = ({ images }) => {
  return (
    <iframe
      srcDoc={`
        <!DOCTYPE html>
        <html>
        <head>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
          <style>
            /* Ajuste das imagens no carrossel */
            .carousel-item img {
              width: 101%; /* Garante que a imagem preencha a largura do carrossel */
              height: 415px; /* Garante que a imagem preencha a altura do carrossel */
              object-fit: cover; /* Cobre todo o espaço do quadrado, sem distorção */
              border-radius: 20px;
              box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1); /* Sombra dos inputs */
            }

            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }

            .carousel-inner {
              width: 100%;
              height: 100%;
            }

            .carousel {
              width: 500px; /* Define a largura fixa do carrossel */
              height: 400px; /* Define a altura fixa do carrossel */
            }

            /* Estilo das setas de navegação */
          </style>
        </head>
        <body>
          <div id="carouselExampleIndicators" class="carousel slide">
            <ol class="carousel-indicators">
              ${images.map((_, index) => `
                <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}"></li>
              `).join('')}
            </ol>
            <div class="carousel-inner">
              ${images.map((image, index) => `
                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                  <img src="${image}" alt="Slide ${index}">
                </div>
              `).join('')}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
      `}
      style={{ borderRadius: '20px', border: '2px solid #6096a8', width: '500px', height: '400px', marginRight: '3%' }}
      frameBorder="0"
      scrolling="no"
    />
  );
};

export default CarouselWrapper;
