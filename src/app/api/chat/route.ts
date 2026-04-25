import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message, mobile, step, userData } = await req.json();

  // Support Number from settings or default
  const supportNumber = "+91 98765 43210";

  // 1. Identification Step
  if (step === 'IDENTIFY') {
    const lead = await prisma.lead.findUnique({
      where: { phone: mobile }
    });

    if (lead) {
      return NextResponse.json({
        reply: `Welcome back to Delish Mama, ${lead.name || 'dear friend'}! ✨ (Repeat Customer Detected)\n\nIt's wonderful to see you again. How can I help you today? You can ask about our best cakes or current timings!`,
        nextStep: 'CHAT',
        user: lead
      });
    } else {
      return NextResponse.json({
        reply: "Welcome to Delish Mama! 🎂 The top-rated Cake Studio in Model Town. Since it's your first time, could you please tell me your Name so I can welcome you properly?",
        nextStep: 'GET_NAME'
      });
    }
  }

  // 2. Lead Generation / Data Saving
  if (step === 'FINALIZE_LEAD') {
    try {
      const newLead = await prisma.lead.upsert({
        where: { phone: mobile },
        update: {
          name: userData.name,
          email: userData.email,
          address: userData.address
        },
        create: {
          phone: mobile,
          name: userData.name,
          email: userData.email,
          address: userData.address
        }
      });
      return NextResponse.json({
        reply: `Thank you, ${userData.name}! ✨ Your profile is all set. We are located in Model Town, New Delhi, and open from 10:00 AM to 10:00 PM. How can I help you choose your masterpiece today?`,
        nextStep: 'CHAT'
      });
    } catch (e) {
      console.error(e);
      return NextResponse.json({ reply: "Something went wrong, but don't worry! I'm still here to help.", nextStep: 'CHAT' });
    }
  }

  // 3. Chat/Product Info Step
  if (step === 'CHAT') {
    const query = message.toLowerCase();

    // Check for "best cake" or similar
    if (query.includes('best') || query.includes('popular')) {
      const products = await prisma.product.findMany({
        take: 3,
        include: { variants: true }
      });
      const list = products.map(p => `🍰 *${p.name}* - Starting ₹${p.basePrice}`).join('\n');
      return NextResponse.json({
        reply: `Our studio favorites are:\n\n${list}\n\nAll our cakes are 100% Veg (Eggless) and made with love! Would you like more details on any of these?`,
        nextStep: 'CHAT'
      });
    }

    // Timings
    if (query.includes('time') || query.includes('open') || query.includes('close')) {
      return NextResponse.json({
        reply: "We are open from *10:00 AM to 10:00 PM* daily! 🕙 Perfect for your celebrations. For any urgent queries, you can reach us at " + supportNumber,
        nextStep: 'CHAT'
      });
    }

    // Location
    if (query.includes('location') || query.includes('where') || query.includes('address')) {
      return NextResponse.json({
        reply: "You can find us at our studio in *Model Town, New Delhi*. 📍 We'd love to have you visit!",
        nextStep: 'CHAT'
      });
    }

    // Search Products
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: message } },
          { description: { contains: message } }
        ]
      }
    });

    if (products.length > 0) {
      const productInfo = products.map(p => 
        `🍰 *${p.name}*\n${p.description}\nPrice: ₹${p.basePrice}\n`
      ).join('\n');
      
      return NextResponse.json({
        reply: `I found these for you:\n\n${productInfo}\n\nWould you like to place an order? Just tell me your preferred delivery time!`,
        nextStep: 'CHAT'
      });
    }

    return NextResponse.json({
      reply: "I'm your Delish Mama assistant! I can tell you about our 100% Veg cakes, timings, or location. What would you like to know? ✨",
      nextStep: 'CHAT'
    });
  }

  return NextResponse.json({ reply: "I'm here to help!", nextStep: 'CHAT' });
}
