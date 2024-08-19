import React from 'react';

const CarouselWrapper = ({ medicamentos, onCardClick }) => {
  return (
    <iframe
      srcDoc={`
        <!DOCTYPE html>
        <html>
        <head>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
          <style>

          .carousel-item {
              cursor: pointer; /* Adiciona o cursor de pointer para itens clicáveis */
            }
          
            .carousel-item img {
              width: 101%;
              height: 280px;
              object-fit: cover;
              border-radius: 20px;
              box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
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
              width: 500px;
              height: 400px;
            }

            .carousel-item .med-name {
              margin-top: 10px;
              font-size: 16px;
              font-weight: bold;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div id="carouselExampleIndicators" class="carousel slide">
            <ol class="carousel-indicators">
              ${medicamentos.map((_, index) => `
                <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}"></li>
              `).join('')}
            </ol>
            <div class="carousel-inner">
              ${medicamentos.map((medicamento, index) => `
                <div class="carousel-item ${index === 0 ? 'active' : ''}" data-id="${medicamento.id}">
                  <img src="${medicamento.Url}" alt="Slide ${index}">
                  <div class="med-name">${medicamento.nome}</div>
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
          <script>
            document.addEventListener('DOMContentLoaded', function() {
              document.querySelectorAll('.carousel-item').forEach(item => {
                item.addEventListener('click', function() {
                  const id = this.getAttribute('data-id');
                  window.parent.postMessage({ type: 'ITEM_CLICK', id: id }, '*');
                });
              });
            });
          </script>
        </body>
        </html>
      `}
      style={{ borderRadius: '20px', border: '2px solid #6096a8', width: '500px', height: '250px', marginLeft: "25px" }}
      frameBorder="0"
      scrolling="no"
    />
  );
};

export default CarouselWrapper;
