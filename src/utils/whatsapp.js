import { toWhatsAppPhone, formatPKR } from './formatters';

export const generateWhatsAppLink = (order, templateType = 'confirmation', storeName = 'Hamari Dukan') => {
  if (!order || !order.customerSnapshot?.phone) return '';

  const phone = toWhatsAppPhone(order.customerSnapshot.phone);
  const customerName = order.customerSnapshot.name;
  const orderNo = order.orderNumber;
  const codAmount = formatPKR(order.codAmount || order.totalAmount);
  const itemsList = (order.items || [])
    .map((item) => `• ${item.productTitle} (${item.quantity}x)`)
    .join('\n');

  let message = '';

  switch (templateType) {
    case 'confirmation':
      message = `Assalam-o-Alaikum ${customerName}! 🌸\n\nApka order *${orderNo}* receive ho gaya hai.\n\n*Items:*\n${itemsList}\n\n*Cash on Delivery Total:* ${codAmount}\n*Delivery City:* ${order.customerSnapshot.city}\n\nKya aap is order ko confirm karna chahein ge? Baraye meherbani reply karke confirm karein taake hum parcel dispatch kar sakein.\n\nShukriya, \n*${storeName}*`;
      break;

    case 'dispatched':
      const courier = order.courier?.name ? order.courier.name.toUpperCase() : 'Courier';
      const tracking = order.courier?.trackingNumber ? `\n*Tracking Number:* ${order.courier.trackingNumber}` : '';
      message = `Assalam-o-Alaikum ${customerName}! 📦\n\nApka order *${orderNo}* dispatch kar diya gaya hai via ${courier}!${tracking}\n\n*COD Amount ready rakhein:* ${codAmount}\n\nParcel aglay 2-3 din mein deliver ho jaye ga.\n\nShukriya, \n*${storeName}*`;
      break;

    case 'delivered':
      message = `Assalam-o-Alaikum ${customerName}! ✨\n\nUmeed hai apko apka order *${orderNo}* pasand aya hoga! Humare sath shopping karne ka bohat shukriya. Agar apko koi query ho toh humein zaroor batayein.\n\n*${storeName}*`;
      break;

    default:
      message = `Assalam-o-Alaikum ${customerName}, yeh message apke order *${orderNo}* ke hawalay se hai (${storeName}).`;
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};
