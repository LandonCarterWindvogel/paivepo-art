const zoomDialog = document.querySelector('#image-zoom');
const zoomImage = zoomDialog?.querySelector('.hc-zoom__image');
const zoomClose = zoomDialog?.querySelector('.hc-zoom__close');

document.querySelectorAll('.hc-product__image').forEach((button) => {
  const image = button.querySelector('img');
  if (!image) return;

  const setImageState = () => {
    button.classList.remove('is-missing');
    button.disabled = false;
  };
  const setMissingState = () => {
    button.classList.add('is-missing');
    button.disabled = true;
  };

  if (image.complete) {
    image.naturalWidth > 0 ? setImageState() : setMissingState();
  } else {
    image.addEventListener('load', setImageState, { once: true });
    image.addEventListener('error', setMissingState, { once: true });
  }
});

if (zoomDialog && zoomImage && zoomClose) {
  document.querySelectorAll('.hc-product__image').forEach((button) => {
    button.addEventListener('click', () => {
      const mainImage = button.querySelector('img');
      const source = button.dataset.zoomSrc || mainImage?.src;
      if (!source || button.disabled) return;

      const showImage = (imageSource) => {
        zoomImage.src = imageSource;
        zoomImage.alt =
          button.dataset.zoomAlt || mainImage?.alt || '';
        zoomDialog.showModal();
        zoomClose.focus();
      };

      if (!button.dataset.zoomSrc || source === mainImage?.src) {
        showImage(source);
      } else {
        const zoomPreview = new Image();
        zoomPreview.addEventListener('load', () => showImage(source), {
          once: true,
        });
        zoomPreview.addEventListener('error', () => {
          if (mainImage?.naturalWidth) showImage(mainImage.src);
        }, { once: true });
        zoomPreview.src = source;
      }
    });
  });

  zoomClose.addEventListener('click', () => zoomDialog.close());
  zoomDialog.addEventListener('click', (event) => {
    if (event.target === zoomDialog) zoomDialog.close();
  });
  zoomDialog.addEventListener('close', () => {
    zoomImage.removeAttribute('src');
    zoomImage.alt = '';
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());
