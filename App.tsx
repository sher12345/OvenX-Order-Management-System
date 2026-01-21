
import React, { useState, useEffect, useMemo } from 'react';
import { MENU_DATA, DEALS_DATA, COLORS } from './constants';
import { CartItem, OrderType, MenuItem, DealItem, OrderRecord } from './types';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [view, setView] = useState<'gateway' | 'menu' | 'deals' | 'checkout'>('gateway');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [tableNum, setTableNum] = useState<string>('');
  const [userAddress, setUserAddress] = useState<string>('');
  const [deliveryCharge, setDeliveryCharge] = useState<number>(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const [tempDlvFee, setTempDlvFee] = useState<string>('');
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  // Selection states (Fixed: added missing states and moved activeItem up to avoid TDZ errors)
  const [activeItem, setActiveItem] = useState<MenuItem | DealItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedQty, setSelectedQty] = useState<number>(1);
  const [instructions, setInstructions] = useState<string>('');
  const [flavorStep, setFlavorStep] = useState<number>(0);
  const [flavorChoices, setFlavorChoices] = useState<string[]>([]);

  const DELIVERY_CALC_URL = 'https://oven-x-deliverer--ovenxoperations.replit.app/ovenxdeliverycalculator?view=customer';

  // Listen for table parameters in URL (QR Support)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');
    if (table) {
      setTableNum(table.toUpperCase());
    }
  }, []);

  // Listen for delivery fee messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && typeof event.data === 'object') {
        const fee = event.data.deliveryFee ?? 
                    event.data.fee ?? 
                    event.data.amount ?? 
                    event.data.charges ?? 
                    (event.data.type === 'delivery_result' ? event.data.data?.fee : undefined);
        
        if (fee !== undefined && fee !== null) {
          setTempDlvFee(Number(fee).toString());
          setDeliveryCharge(Number(fee));
          setShowCalcModal(false);
          setHasCalculated(true);
          setOrderType('Delivery');
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.qty), 0), [cart]);
  const serviceCharge = orderType === 'Dine-In' ? Math.round(subtotal * 0.07) : 0;
  const effectiveDeliveryCharge = orderType === 'Delivery' ? deliveryCharge : 0;
  const grandTotal = subtotal + serviceCharge + effectiveDeliveryCharge;

  const resetSelection = () => {
    setActiveItem(null);
    setSelectedSize(null);
    setSelectedQty(1);
    setInstructions('');
    setFlavorStep(0);
    setFlavorChoices([]);
  };

  const addToCart = () => {
    if (!activeItem) return;
    let finalName = activeItem.name;
    let finalPrice = 0;

    if ('price' in activeItem && typeof activeItem.price === 'object') {
      if (selectedSize) {
        finalPrice = (activeItem.price as any)[selectedSize];
        finalName += ` (${selectedSize})`;
      }
    } else {
      finalPrice = (activeItem as any).price;
    }

    const newItem: CartItem = {
      cartId: Math.random().toString(36).substr(2, 9),
      id: activeItem.id,
      name: finalName,
      price: finalPrice,
      qty: selectedQty,
      note: instructions,
      flavorNotes: flavorChoices.join(', ')
    };

    setCart([...cart, newItem]);
    resetSelection();
  };

  const finalizeOrder = () => {
    const itemsText = cart.map(i => `${i.qty}x ${i.name}${i.flavorNotes ? ' ['+i.flavorNotes+']' : ''}`).join('\n');
    const orderHeader = `*OVEN X - ${orderType?.toUpperCase()} ORDER*`;
    const tableInfo = tableNum ? `\n*TABLE: ${tableNum}*` : '';
    const footer = `\n\nSubtotal: Rs ${subtotal}${serviceCharge > 0 ? '\nS.C (7%): Rs ' + serviceCharge : ''}${effectiveDeliveryCharge > 0 ? '\nDelivery Charge: Rs ' + effectiveDeliveryCharge : ''}\n*Grand Total: Rs ${grandTotal}*\n\n${userAddress ? '*Address:* ' + userAddress : ''}`;
    
    const msg = `${orderHeader}${tableInfo}\n\n${itemsText}${footer}`;
    
    const newOrder: OrderRecord = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      items: [...cart],
      orderType: orderType || 'Takeaway',
      tableNum: tableNum,
      subtotal,
      serviceCharge,
      deliveryCharge: effectiveDeliveryCharge,
      total: grandTotal
    };

    const existing = localStorage.getItem('ovenx_orders');
    const orders = existing ? JSON.parse(existing) : [];
    orders.push(newOrder);
    localStorage.setItem('ovenx_orders', JSON.stringify(orders));

    window.open(`https://wa.me/923001450301?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCheckoutBack = () => {
    if (orderType) {
      setOrderType(null);
      setDeliveryCharge(0);
      setTempDlvFee('');
      setHasCalculated(false);
    } else {
      setView('menu');
    }
  };

  const handleDeliveryContinue = () => {
    if (!hasCalculated) {
      alert("Please click delivery charges button first to continue");
      return;
    }
    const fee = Number(tempDlvFee);
    if (!tempDlvFee || isNaN(fee) || fee <= 0) {
      alert("Please enter valid delivery charges to continue");
      return;
    }
    setDeliveryCharge(fee);
    setOrderType('Delivery');
  };

  if (view === 'gateway') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#1a1a1a] to-black flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="mb-10 animate-bounce">
          <div className="text-7xl font-black mb-2 tracking-tighter">OVEN <span className="text-[#f37021]">X</span></div>
          {tableNum ? (
             <div className="bg-[#f37021] text-white px-8 py-3 rounded-full font-black text-sm uppercase shadow-2xl shadow-orange-500/30 border-2 border-white/20">
               Welcome! Table {tableNum}
             </div>
          ) : (
            <p className="text-gray-400 font-medium tracking-wide uppercase text-[10px] tracking-[0.3em]">Freshly Baked, Truly Authentic</p>
          )}
        </div>
        <div className="w-full max-w-sm flex flex-col gap-4">
          <button onClick={() => setView('deals')} className="bg-[#f37021] py-6 rounded-3xl font-black text-lg uppercase shadow-2xl active:scale-95 transition-all">🔥 View Hot Deals</button>
          <button onClick={() => setView('menu')} className="bg-[#8b0000] py-6 rounded-3xl font-black text-lg uppercase shadow-2xl active:scale-95 transition-all">📖 Open Full Menu</button>
          <button onClick={() => setShowAdmin(true)} className="mt-16 text-gray-600 font-black text-[10px] uppercase hover:text-orange-500 transition-colors tracking-[0.3em] flex items-center justify-center gap-2">
            <i className="fa-solid fa-lock"></i> Admin Panel
          </button>
        </div>
        {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32 animate-fadeIn">
      <header className="sticky top-0 z-50 bg-[#8b0000] text-white px-5 py-3 border-b-4 border-[#f37021] flex justify-between items-center shadow-lg">
        <button onClick={() => setView('gateway')} className="bg-[#f37021] px-4 py-2 rounded-xl text-[10px] font-black uppercase"><i className="fa-solid fa-house"></i> Home</button>
        <div className="text-xl font-black">OVEN <span className="text-[#f37021]">X</span> {tableNum && <span className="text-[10px] opacity-60 ml-1">T-{tableNum}</span>}</div>
        <div className="w-10"></div>
      </header>

      <div className="sticky top-[60px] z-40 bg-white p-4 flex gap-2 border-b">
        <button onClick={() => setView('menu')} className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase border transition-all ${view === 'menu' ? 'bg-[#8b0000] text-white border-[#8b0000] shadow-lg' : 'bg-white text-gray-500 border-gray-100'}`}>Full Menu</button>
        <button onClick={() => setView('deals')} className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase border transition-all ${view === 'deals' ? 'bg-[#8b0000] text-white border-[#8b0000] shadow-lg' : 'bg-white text-gray-500 border-gray-100'}`}>Special Deals</button>
      </div>

      <div className="max-w-xl mx-auto p-4">
        {view === 'deals' ? (
          <div className="space-y-8">
            {DEALS_DATA.map(deal => (
              <div key={deal.id} className="relative bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-xl group">
                <div className="absolute top-4 right-4 bg-[#f37021] text-white px-5 py-2 rounded-full text-[10px] font-black uppercase z-10 shadow-lg">{deal.badge}</div>
                <div className="overflow-hidden"><img src={deal.img} alt={deal.name} className="w-full h-56 object-cover bg-gray-50 group-hover:scale-105 transition-transform duration-500" /></div>
                <div className="p-8">
                  <h3 className="text-2xl font-black text-[#8b0000] uppercase mb-2 leading-tight">{deal.name}</h3>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed whitespace-pre-line">{deal.desc}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-black text-[#f37021]">Rs {deal.price}</span>
                    <button onClick={() => setActiveItem(deal)} className="bg-[#f37021] text-white px-10 py-4 rounded-2xl font-black uppercase text-xs shadow-xl active:scale-95 transition-all">Add Deal</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : view === 'menu' ? (
          <div className="px-2">
            {Object.keys(MENU_DATA).map(cat => (
              <div key={cat} className="mb-10">
                <h2 className="text-xs font-black text-[#8b0000] uppercase border-b-2 border-[#f37021] pb-1 mb-5 inline-block tracking-widest">{cat}</h2>
                <div className="grid grid-cols-2 gap-4">
                  {MENU_DATA[cat].map(item => (
                    <button key={item.id} onClick={() => setActiveItem(item)} className="bg-white border-2 border-gray-50 p-6 rounded-[30px] text-center shadow-sm hover:border-[#f37021] hover:bg-gray-50 transition-all active:scale-95 h-full flex flex-col justify-center">
                      <div className="font-bold text-gray-800 text-sm leading-tight mb-3 uppercase tracking-tight">{item.name}</div>
                      <div className="text-[#f37021] font-black text-xs">{typeof item.price === 'object' ? 'Choose Size' : `Rs ${item.price}`}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {cart.length > 0 && view !== 'checkout' && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-6">
          <div className="bg-[#8b0000] text-white p-6 rounded-[40px] shadow-2xl flex justify-between items-center max-w-xl mx-auto border-t-4 border-[#f37021]">
            <div>
              <div className="text-[10px] font-black uppercase opacity-60 tracking-wider">{cart.length} Items</div>
              <div className="text-2xl font-black tracking-tighter">Rs {subtotal}</div>
            </div>
            <button onClick={() => setView('checkout')} className="bg-[#f37021] px-10 py-4 rounded-3xl font-black uppercase text-sm shadow-xl active:scale-95 transition-all flex items-center gap-2">Checkout <i className="fa-solid fa-arrow-right"></i></button>
          </div>
        </div>
      )}

      {/* Product Customizer */}
      {activeItem && (
        <div className="fixed inset-0 z-[1000] bg-black bg-opacity-80 flex items-center justify-center p-6 backdrop-blur-md">
          <div className="bg-white w-full max-w-md p-10 rounded-[50px] shadow-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <h3 className="text-3xl font-black text-[#8b0000] uppercase mb-6 leading-tight tracking-tighter">{activeItem.name}</h3>
            
            {'price' in activeItem && typeof activeItem.price === 'object' && !selectedSize && (
              <div className="mb-8">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Select Size</p>
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(activeItem.price).map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)} className="p-6 border-2 border-gray-100 rounded-3xl font-bold text-gray-700 hover:border-[#f37021] hover:bg-orange-50 transition-all text-center">
                      <div className="text-xs font-black uppercase mb-1">{s}</div>
                      <div className="text-[#f37021] font-black">Rs {(activeItem.price as any)[s]}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {'flavorsNeeded' in activeItem && activeItem.flavorsNeeded && flavorStep < activeItem.flavorsNeeded.length && (
              <div className="mb-8 animate-fadeIn">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Step {flavorStep + 1} / {activeItem.flavorsNeeded.length}</p>
                <h4 className="text-xl font-black mb-5 text-gray-800">Pick {activeItem.flavorsNeeded[flavorStep].label}</h4>
                <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                  {(() => {
                    const cat = activeItem.flavorsNeeded![flavorStep].cat;
                    const items = cat === 'Pan/Premium' ? [...MENU_DATA['Pan Pizza'], ...MENU_DATA['Premium Pizza']] : MENU_DATA[cat] || [];
                    return items.map(f => (
                      <button key={f.id} onClick={() => { setFlavorChoices([...flavorChoices, `${activeItem.flavorsNeeded![flavorStep].label}: ${f.name}`]); setFlavorStep(flavorStep + 1); }} className="p-4 border-2 border-gray-50 bg-gray-50 rounded-[25px] font-bold text-gray-800 text-[10px] hover:border-[#f37021] transition-all uppercase leading-tight">{f.name}</button>
                    ));
                  })()}
                </div>
              </div>
            )}

            {(!('price' in activeItem && typeof activeItem.price === 'object') || selectedSize) && (!('flavorsNeeded' in activeItem && activeItem.flavorsNeeded) || flavorStep >= activeItem.flavorsNeeded.length) && (
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-4 text-center tracking-widest">Quantity</p>
                  <div className="flex justify-center gap-3">
                    {[1, 2, 3, 4, 5].map(q => (
                      <button key={q} onClick={() => setSelectedQty(q)} className={`w-14 h-14 rounded-full font-black transition-all ${selectedQty === q ? 'bg-[#8b0000] text-white shadow-xl scale-110' : 'bg-gray-100 text-gray-400'}`}>{q}</button>
                    ))}
                  </div>
                </div>
                <textarea placeholder="Extra instructions?" value={instructions} onChange={(e) => setInstructions(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 rounded-3xl p-6 text-sm focus:border-[#f37021] outline-none transition-all h-28 resize-none font-medium" />
                <div className="flex gap-4">
                  <button onClick={resetSelection} className="flex-1 py-5 font-black uppercase text-[10px] text-gray-400 tracking-widest">Discard</button>
                  <button onClick={addToCart} className="flex-[2] bg-[#f37021] text-white py-5 rounded-3xl font-black uppercase text-xs shadow-2xl active:scale-95 transition-all">Add To Cart</button>
                </div>
              </div>
            )}
            {activeItem && !(((!('price' in activeItem && typeof activeItem.price === 'object') || selectedSize) && (!('flavorsNeeded' in activeItem && activeItem.flavorsNeeded) || flavorStep >= activeItem.flavorsNeeded.length))) && (
               <button onClick={resetSelection} className="w-full mt-8 py-4 font-black uppercase text-[10px] text-gray-300 tracking-widest underline decoration-dotted">Back / Close</button>
            )}
          </div>
        </div>
      )}

      {/* Checkout Section */}
      {view === 'checkout' && (
        <div className="fixed inset-0 z-[2000] bg-white overflow-y-auto">
          <div className="max-w-xl mx-auto p-8 min-h-screen flex flex-col animate-fadeIn">
            <header className="flex items-center gap-6 mb-10">
              {/* SMART BACK BUTTON */}
              <button onClick={handleCheckoutBack} className="bg-gray-100 p-4 rounded-full w-12 h-12 flex items-center justify-center text-lg active:scale-90 transition-all shadow-sm"><i className="fa-solid fa-arrow-left"></i></button>
              <h2 className="text-3xl font-black uppercase tracking-tight">Checkout</h2>
            </header>

            {!orderType ? (
              <div className="flex flex-col gap-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-black text-gray-800 uppercase">Select Service</h3>
                  <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">How would you like your order?</p>
                </div>
                <div className="grid gap-4">
                  <button onClick={() => { setOrderType('Dine-In'); setDeliveryCharge(0); }} className="bg-blue-600 text-white p-8 rounded-[40px] font-black uppercase text-lg flex items-center justify-between shadow-xl active:scale-95 transition-all">
                    <span>🍽️ Dine-In</span>
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                  <button onClick={() => { setOrderType('Takeaway'); setDeliveryCharge(0); }} className="bg-gray-800 text-white p-8 rounded-[40px] font-black uppercase text-lg flex items-center justify-between shadow-xl active:scale-95 transition-all">
                    <span>🥡 Takeaway</span>
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                  {/* Smart Check: Hide delivery if tableNum exists (customer is in-store) */}
                  {!tableNum && (
                    <div className="bg-[#8b0000] text-white p-10 rounded-[45px] shadow-2xl space-y-8 relative overflow-hidden">
                      <div className="flex items-center gap-3"><i className="fa-solid fa-truck-fast text-2xl"></i><span className="font-black uppercase text-xl">Delivery</span></div>
                      <div className="space-y-5">
                        <button onClick={() => { setShowCalcModal(true); setHasCalculated(true); }} className="w-full bg-white text-[#8b0000] py-5 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg hover:bg-gray-50">
                          <i className="fa-solid fa-calculator"></i> {hasCalculated ? "Recalculate Charges" : "Calculate Charges"}
                        </button>
                        
                        <div className="relative group">
                          <p className={`text-[9px] font-bold uppercase transition-all mb-1 ml-1 ${hasCalculated ? "text-white/60" : "text-red-400 animate-pulse"}`}>
                            {hasCalculated ? "Step 2: Enter Delivery Amount" : "Step 1: Click Calculate Above"}
                          </p>
                          <input 
                            type="number" 
                            placeholder="Amount in Rs" 
                            value={tempDlvFee} 
                            onChange={(e) => setTempDlvFee(e.target.value)} 
                            className={`w-full bg-black/20 border-2 px-6 py-5 rounded-2xl outline-none transition-all text-xl font-black text-center placeholder:text-white/20 text-white ${hasCalculated ? "border-white/10 focus:border-white/30" : "border-red-500/50 bg-red-900/10 cursor-not-allowed"}`}
                            disabled={!hasCalculated}
                          />
                        </div>

                        <button 
                          onClick={handleDeliveryContinue} 
                          className={`w-full py-6 rounded-2xl font-black uppercase text-sm shadow-xl active:scale-95 transition-all ${(!hasCalculated || !tempDlvFee) ? "bg-gray-500/50 text-white/50 cursor-not-allowed" : "bg-[#f37021] text-white"}`}
                        >
                          Continue Order
                        </button>
                      </div>
                      
                      {!hasCalculated && (
                        <div className="text-[10px] font-black text-center text-red-300 uppercase tracking-tighter mt-4 animate-bounce">
                          Please click delivery charges button first
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col flex-1 space-y-8">
                <div className="flex justify-between items-center px-2">
                   <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{orderType} Order {tableNum && `(T-${tableNum})`}</div>
                   <button onClick={() => { setOrderType(null); setDeliveryCharge(0); setTempDlvFee(''); setHasCalculated(false); }} className="text-[10px] font-black text-gray-400 uppercase underline decoration-dotted">Change Type</button>
                </div>
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.cartId} className="bg-white border-2 border-gray-50 p-6 rounded-[35px] flex justify-between items-center">
                      <div className="flex-1">
                        <div className="font-black text-gray-900 uppercase text-sm mb-1">{item.qty}x {item.name}</div>
                        {item.flavorNotes && <div className="text-[9px] text-orange-500 font-black uppercase tracking-wider mb-1">{item.flavorNotes}</div>}
                        <div className="text-xs font-black text-gray-400">Rs {item.price * item.qty}</div>
                      </div>
                      <button onClick={() => setCart(cart.filter(c => c.cartId !== item.cartId))} className="text-red-300 w-12 h-12 flex items-center justify-center hover:bg-red-50 hover:text-red-500 rounded-full transition-all"><i className="fa-solid fa-trash"></i></button>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 p-10 rounded-[50px] space-y-4">
                  {orderType === 'Delivery' && (
                    <div className="mb-6 space-y-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery Address</p>
                      <input type="text" placeholder="Enter Full House Address" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} className="w-full px-6 py-5 rounded-2xl border-2 border-gray-200 outline-none focus:border-orange-500 text-sm font-bold shadow-sm" />
                    </div>
                  )}
                  <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest"><span>Subtotal</span><span>Rs {subtotal}</span></div>
                  {serviceCharge > 0 && <div className="flex justify-between text-xs font-black text-blue-500 uppercase tracking-widest"><span>S.C (7%)</span><span>Rs {serviceCharge}</span></div>}
                  {effectiveDeliveryCharge > 0 && <div className="flex justify-between text-xs font-black text-orange-600 uppercase tracking-widest"><span>Delivery</span><span>Rs {effectiveDeliveryCharge}</span></div>}
                  <div className="flex justify-between text-2xl font-black text-gray-900 border-t-2 border-gray-200 pt-6 mt-4"><span>Grand Total</span><span className="text-[#8b0000]">Rs {grandTotal}</span></div>
                </div>
                <button onClick={finalizeOrder} className="w-full bg-[#25D366] text-white py-7 rounded-[40px] font-black uppercase text-xl shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all"><i className="fa-brands fa-whatsapp text-3xl"></i> Send to WhatsApp</button>
                <button onClick={() => { if(confirm('Clear entire cart?')) { setCart([]); setView('menu'); } }} className="text-gray-400 font-black uppercase text-[10px] tracking-widest pt-4">Clear Order</button>
              </div>
            )}
          </div>
        </div>
      )}

      {showCalcModal && (
        <div className="fixed inset-0 z-[5000] bg-white animate-slideInUp flex flex-col">
          <header className="p-4 border-b flex justify-between items-center bg-gray-50"><span className="font-black text-[10px] uppercase tracking-widest text-gray-400 ml-4">Fee Estimator</span><button onClick={() => setShowCalcModal(false)} className="w-10 h-10 bg-white border rounded-full flex items-center justify-center mr-2"><i className="fa-solid fa-xmark text-gray-400"></i></button></header>
          <div className="flex-1 relative"><iframe src={DELIVERY_CALC_URL} className="w-full h-full border-none" title="OvenX Delivery Calculator" allow="geolocation" /></div>
          <div className="p-6 bg-white border-t"><button onClick={() => setShowCalcModal(false)} className="w-full bg-[#f37021] text-white py-6 rounded-[30px] font-black uppercase text-sm shadow-2xl active:scale-95 transition-all">Close Estimator</button></div>
        </div>
      )}

      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}
    </div>
  );
};

export default App;
