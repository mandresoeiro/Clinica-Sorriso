(() => {
 const map=document.querySelector('[data-clinic-map]');if(!map)return;
 map.querySelector('[data-load-map]').addEventListener('click',()=>{
  const frame=document.createElement('iframe');
  frame.title='Localização da Odonto Personnallite: Travessa Almirante Wandenkolk, 1243, Belém, Pará';
  frame.src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.5454982931874!2d-48.4851944!3d-1.447293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92a48e991a69a33b%3A0x4b854aae13c76694!2sTv.%20Alm.%20Wandenkolk%2C%201243%20-%20Umarizal%2C%20Bel%C3%A9m%20-%20PA%2C%2066055-045!5e0!3m2!1spt-BR!2sbr!4v1792609931525!5m2!1spt-BR!2sbr';
  frame.loading='eager';frame.referrerPolicy='strict-origin-when-cross-origin';frame.allowFullscreen=true;
  map.querySelector('.clinic-map-placeholder').replaceWith(frame);
 });
})();
