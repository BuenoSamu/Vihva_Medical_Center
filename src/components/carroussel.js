// src/components/CarouselWrapper.js
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
            /* Aumenta o tamanho das imagens no carrossel */
            .carousel-item img {
            margin-top: 40px;
              width: 800px; /* Largura total do carrossel */
              height: 400px; /* Define a altura desejada */
              object-fit: cover; /* Garante que a imagem preencha o contêiner */
            }
          </style>
        </head>
        <body style="background-color: transparent;">
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
      style={{ border: 'none', width: '100%', height: '600px' }} // Ajuste a altura do iframe também se necessário
    />
  );
};

export default CarouselWrapper;
