import { useEffect, useState } from "react";

type Product = {
  id: number;
  image: string;
  name: string;
  price: number;
  option?: string;
};

type CartItem = {
  productId: number;
  image: string;
  name: string;
  price: number;
  option?: string;
  qty: number;
};

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cash, setCash] = useState<number>(0);
  const [change, setChange] = useState<number>(0);
  const [receiptNo, setReceiptNo] = useState<string | null>(null);
  const [receiptDate, setReceiptDate] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [isSubmitable, setIsSubmitable] = useState<boolean>(false);
  const [isShowModalReceipt, setIsShowModalReceipt] = useState<boolean>(false);

  const loadProducts = async () => {
    const response = await fetch("sample.json");
    const data = await response.json();
    setProducts(data.products);
  };

  const priceFormat = (number: number) => {
    return number ? `Rp. ${numberFormat(number)}` : `Rp. 0`;
  };

  const addToCart = (product: Product) => {
    const index = findCartIndex(product);
    const tempCart = [...cart];
    if (index === -1) {
      tempCart.push({
        productId: product.id,
        image: product.image,
        name: product.name,
        price: product.price,
        option: product.option,
        qty: 1,
      });
    } else {
      tempCart[index].qty += 1;
    }
    setCart(tempCart);
    beep();
  };

  const findCartIndex = (product: Product) => {
    return cart.findIndex((p) => p.productId === product.id);
  };

  const getItemsCount = () => {
    return cart.reduce((count, item) => count + item.qty, 0);
  };

  const numberFormat = (number: number) => {
    if (!number) return "";
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const addCash = (amount: number) => {
    console.log(`click ${amount}`);
    setCash((cash || 0) + amount);
    beep();
  };

  const addQty = (item: CartItem, qty: number) => {
    const index = cart.findIndex((i) => i.productId === item.productId);
    if (index === -1) {
      return;
    }
    const afterAdd = item.qty + qty;
    const tempCart = [...cart];
    if (afterAdd === 0) {
      tempCart.splice(index, 1);
      clearSound();
    } else {
      tempCart[index].qty = afterAdd;
      beep();
    }
    setCart(tempCart);
  };

  const updateCash = (value: string) => {
    setCash(parseFloat(value.replace(/[^0-9]+/g, "")));
  };
  const getTotalPrice = (): number => {
    return cart.reduce((total, item) => total + item.qty * item.price, 0);
  };

  const submit = () => {
    const time = new Date();
    setIsShowModalReceipt(true);
    setReceiptNo(`TWPOS-KS-${Math.round(time.getTime() / 1000)}`);
    setReceiptDate(dateFormat(time));
  };

  const dateFormat = (date: Date) => {
    const formatter = new Intl.DateTimeFormat("id", {
      dateStyle: "short",
      timeStyle: "short",
    });
    return formatter.format(date);
  };

  const clear = () => {
    setCash(0);
    setCart([]);
    setReceiptNo(null);
    setReceiptDate(null);
    clearSound();
  };

  const printAndProceed = () => {
    const receiptContent = document.getElementById('receipt-content');
    const printArea = document.getElementById('print-area');
    if (!receiptContent || !printArea) return;

    const titleBefore: string = document.title;
    printArea.innerHTML = receiptContent.innerHTML;

    window.print();

    printArea.innerHTML = "";
    document.title = titleBefore;
    setIsShowModalReceipt(false);
    clear();
  }

  const beep = () => {
    playSound("sound/beep-29.mp3");
  };
  const clearSound = () => {
    playSound("sound/button-21.mp3");
  };
  const playSound = (src: string) => {
    const sound = new Audio(src);
    sound.play();
    sound.onended = () => {
      console.log("Sound finished playing");
    };
  };

  useEffect(() => {
    document.body.classList.add("bg-[#ECEFF1]");

    loadProducts();

    return () => {
      document.body.classList.remove("bg-[#ECEFF1]");
    };
  }, []);

  useEffect(() => {
    const rg = keyword ? new RegExp(keyword, "gi") : null;
    setFilteredProducts(products.filter((p) => !rg || p.name.match(rg)));
  }, [keyword, products]);

  useEffect(() => {
    setChange(cash - cart.reduce((total, item) => total + item.qty * item.price, 0));
  }, [cart, cash]);

  useEffect(() => {
    setIsSubmitable(change >= 0 && cart.length > 0);
  }, [cart, change]);

  return (
    <>
      <div className="hide-print flex flex-row h-screen antialiased text-blue-gray-800">
        <div className="flex flex-row w-auto flex-shrink-0 pl-4 pr-2 py-4">
          <div className="flex flex-col items-center py-4 flex-shrink-0 w-20 bg-cyan-500 rounded-3xl">
            <a
              href="#"
              className="flex items-center justify-center h-12 w-12 bg-cyan-50 text-cyan-700 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="123.3"
                height="123.233"
                viewBox="0 0 32.623 32.605"
              >
                <path
                  d="M15.612 0c-.36.003-.705.01-1.03.021C8.657.223 5.742 1.123 3.4 3.472.714 6.166-.145 9.758.019 17.607c.137 6.52.965 9.271 3.542 11.768 1.31 1.269 2.658 2 4.73 2.57.846.232 2.73.547 3.56.596.36.021 2.336.048 4.392.06 3.162.018 4.031-.016 5.63-.221 3.915-.504 6.43-1.778 8.234-4.173 1.806-2.396 2.514-5.731 2.516-11.846.001-4.407-.42-7.59-1.278-9.643-1.463-3.501-4.183-5.53-8.394-6.258-1.634-.283-4.823-.475-7.339-.46z"
                  fill="#fff"
                />
                <path
                  d="M16.202 13.758c-.056 0-.11 0-.16.003-.926.031-1.38.172-1.747.538-.42.421-.553.982-.528 2.208.022 1.018.151 1.447.553 1.837.205.198.415.313.739.402.132.036.426.085.556.093.056.003.365.007.686.009.494.003.63-.002.879-.035.611-.078 1.004-.277 1.286-.651.282-.374.392-.895.393-1.85 0-.688-.066-1.185-.2-1.506-.228-.547-.653-.864-1.31-.977a7.91 7.91 0 00-1.147-.072zM16.22 19.926c-.056 0-.11 0-.16.003-.925.031-1.38.172-1.746.539-.42.42-.554.981-.528 2.207.02 1.018.15 1.448.553 1.838.204.198.415.312.738.4.132.037.426.086.556.094.056.003.365.007.686.009.494.003.63-.002.88-.034.61-.08 1.003-.278 1.285-.652.282-.374.393-.895.393-1.85 0-.688-.066-1.185-.2-1.506-.228-.547-.653-.863-1.31-.977a7.91 7.91 0 00-1.146-.072zM22.468 13.736c-.056 0-.11.001-.161.003-.925.032-1.38.172-1.746.54-.42.42-.554.98-.528 2.207.021 1.018.15 1.447.553 1.837.205.198.415.313.739.401.132.037.426.086.556.094.056.003.364.007.685.009.494.003.63-.002.88-.035.611-.078 1.004-.277 1.285-.651.282-.375.393-.895.393-1.85 0-.688-.065-1.185-.2-1.506-.228-.547-.653-.864-1.31-.977a7.91 7.91 0 00-1.146-.072z"
                  fill="#00dace"
                />
                <path
                  d="M9.937 13.736c-.056 0-.11.001-.161.003-.925.032-1.38.172-1.746.54-.42.42-.554.98-.528 2.207.021 1.018.15 1.447.553 1.837.204.198.415.313.738.401.133.037.427.086.556.094.056.003.365.007.686.009.494.003.63-.002.88-.035.61-.078 1.003-.277 1.285-.651.282-.375.393-.895.393-1.85 0-.688-.066-1.185-.2-1.506-.228-.547-.653-.864-1.31-.977a7.91 7.91 0 00-1.146-.072zM16.202 7.59c-.056 0-.11 0-.16.002-.926.032-1.38.172-1.747.54-.42.42-.553.98-.528 2.206.022 1.019.151 1.448.553 1.838.205.198.415.312.739.401.132.037.426.086.556.093.056.003.365.007.686.01.494.002.63-.003.879-.035.611-.079 1.004-.278 1.286-.652.282-.374.392-.895.393-1.85 0-.688-.066-1.185-.2-1.505-.228-.547-.653-.864-1.31-.978a7.91 7.91 0 00-1.147-.071z"
                  fill="#00bcd4"
                />
                <g>
                  <path
                    d="M15.612 0c-.36.003-.705.01-1.03.021C8.657.223 5.742 1.123 3.4 3.472.714 6.166-.145 9.758.019 17.607c.137 6.52.965 9.271 3.542 11.768 1.31 1.269 2.658 2 4.73 2.57.846.232 2.73.547 3.56.596.36.021 2.336.048 4.392.06 3.162.018 4.031-.016 5.63-.221 3.915-.504 6.43-1.778 8.234-4.173 1.806-2.396 2.514-5.731 2.516-11.846.001-4.407-.42-7.59-1.278-9.643-1.463-3.501-4.183-5.53-8.394-6.258-1.634-.283-4.823-.475-7.339-.46z"
                    fill="#fff"
                  />
                  <path
                    d="M16.202 13.758c-.056 0-.11 0-.16.003-.926.031-1.38.172-1.747.538-.42.421-.553.982-.528 2.208.022 1.018.151 1.447.553 1.837.205.198.415.313.739.402.132.036.426.085.556.093.056.003.365.007.686.009.494.003.63-.002.879-.035.611-.078 1.004-.277 1.286-.651.282-.374.392-.895.393-1.85 0-.688-.066-1.185-.2-1.506-.228-.547-.653-.864-1.31-.977a7.91 7.91 0 00-1.147-.072zM16.22 19.926c-.056 0-.11 0-.16.003-.925.031-1.38.172-1.746.539-.42.42-.554.981-.528 2.207.02 1.018.15 1.448.553 1.838.204.198.415.312.738.4.132.037.426.086.556.094.056.003.365.007.686.009.494.003.63-.002.88-.034.61-.08 1.003-.278 1.285-.652.282-.374.393-.895.393-1.85 0-.688-.066-1.185-.2-1.506-.228-.547-.653-.863-1.31-.977a7.91 7.91 0 00-1.146-.072zM22.468 13.736c-.056 0-.11.001-.161.003-.925.032-1.38.172-1.746.54-.42.42-.554.98-.528 2.207.021 1.018.15 1.447.553 1.837.205.198.415.313.739.401.132.037.426.086.556.094.056.003.364.007.685.009.494.003.63-.002.88-.035.611-.078 1.004-.277 1.285-.651.282-.375.393-.895.393-1.85 0-.688-.065-1.185-.2-1.506-.228-.547-.653-.864-1.31-.977a7.91 7.91 0 00-1.146-.072z"
                    fill="#00dace"
                  />
                  <path
                    d="M9.937 13.736c-.056 0-.11.001-.161.003-.925.032-1.38.172-1.746.54-.42.42-.554.98-.528 2.207.021 1.018.15 1.447.553 1.837.204.198.415.313.738.401.133.037.427.086.556.094.056.003.365.007.686.009.494.003.63-.002.88-.035.61-.078 1.003-.277 1.285-.651.282-.375.393-.895.393-1.85 0-.688-.066-1.185-.2-1.506-.228-.547-.653-.864-1.31-.977a7.91 7.91 0 00-1.146-.072zM16.202 7.59c-.056 0-.11 0-.16.002-.926.032-1.38.172-1.747.54-.42.42-.553.98-.528 2.206.022 1.019.151 1.448.553 1.838.205.198.415.312.739.401.132.037.426.086.556.093.056.003.365.007.686.01.494.002.63-.003.879-.035.611-.079 1.004-.278 1.286-.652.282-.374.392-.895.393-1.85 0-.688-.066-1.185-.2-1.505-.228-.547-.653-.864-1.31-.978a7.91 7.91 0 00-1.147-.071z"
                    fill="#00bcd4"
                  />
                </g>
              </svg>
            </a>
            <ul className="flex flex-col space-y-2 mt-12">
              <li>
                <a href="#" className="flex items-center">
                  <span
                    className="flex items-center justify-center h-12 w-12 rounded-2xl bg-[#4dd0e1] shadow-lg text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center">
                  <span className="flex items-center justify-center text-cyan-100 hover:bg-cyan-400 h-12 w-12 rounded-2xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center">
                  <span className="flex items-center justify-center text-cyan-100 hover:bg-cyan-400 h-12 w-12 rounded-2xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center">
                  <span className="flex items-center justify-center text-cyan-100 hover:bg-cyan-400 h-12 w-12 rounded-2xl">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </span>
                </a>
              </li>
            </ul>
            <a
              href="https://github.com/emsifa/tailwind-pos"
              target="_blank"
              className="mt-auto flex items-center justify-center text-cyan-200 hover:text-cyan-100 h-10 w-10 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
        {/* <!-- page content --> */}
        <div className="flex-grow flex">
          {/* <!-- store menu --> */}
          <div className="flex flex-col bg-blue-gray-50 h-full w-full py-4">
            <div className="flex px-2 flex-row relative">
              <div className="absolute left-5 top-3 px-2 py-2 rounded-full bg-cyan-500 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="bg-white rounded-3xl shadow text-lg full w-full h-16 py-4 pl-16 transition-shadow focus:shadow-2xl focus:outline-none"
                placeholder="Cari menu ..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="h-full overflow-hidden mt-4">
              <div className="h-full overflow-y-auto px-2">
                {filteredProducts.length === 0 ? (
                  <div className="select-none bg-[#CFD8DC] rounded-3xl flex flex-wrap content-center justify-center h-full opacity-25">
                    <div className="w-full text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-24 w-24 inline-block"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                        />
                      </svg>
                      <p className="text-xl">
                        YOU DON&apos;T HAVE
                        <br />
                        ANY PRODUCTS TO SHOW
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-4 pb-3">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        role="button"
                        className="select-none cursor-pointer transition-shadow overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg"
                        title={product.name}
                        onClick={() => addToCart(product)}
                      >
                        <img src={product.image} alt={product.name} />
                        <div className="flex pb-3 px-3 text-sm -mt-3">
                          <p className="flex-grow truncate mr-1">
                            {product.name}
                          </p>
                          <p className="nowrap font-semibold">
                            {priceFormat(product.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-5/12 flex flex-col bg-[#ECEFF1] h-full pr-4 pl-2 py-4">
            <div className="bg-white rounded-3xl flex flex-col h-full shadow">
              {cart.length === 0 ? (
                <div className="flex-1 w-full p-4 opacity-25 select-none flex flex-col flex-wrap content-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 inline-block"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p>CART EMPTY</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col overflow-auto">
                  <div className="h-16 text-center flex justify-center">
                    <div className="pl-8 text-left text-lg py-4 relative">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 inline-block"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      {getItemsCount() > 0 ? (
                        <div className="text-center absolute bg-cyan-500 text-white w-5 h-5 text-xs p-0 leading-5 rounded-full -right-2 top-3">
                          {getItemsCount()}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="flex-grow px-8 text-right text-lg py-4 relative">
                      <button
                        onClick={() => clear()}
                        className="text-blue-gray-300 hover:text-pink-500 focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 inline-block"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 w-full px-4 overflow-auto">
                    {cart.map((item) => (
                      <div
                        key={item.productId}
                        className="select-none mb-3 bg-[#ECEFF1] rounded-lg w-full text-[#455A64] py-2 px-2 flex justify-center"
                      >
                        <img
                          src={item.image}
                          alt=""
                          className="rounded-lg h-10 w-10 bg-white shadow mr-2"
                        />
                        <div className="flex-grow">
                          <h5 className="text-sm">{item.name}</h5>
                          <p className="text-xs block">
                            {priceFormat(item.price)}
                          </p>
                        </div>
                        <div className="py-1">
                          <div className="w-28 grid grid-cols-3 gap-2 ml-2">
                            <button
                              onClick={() => addQty(item, -1)}
                              className="rounded-lg text-center py-1 text-white bg-[#546E7a] hover:bg-[#455a64] focus:outline-none"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-3 inline-block"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M20 12H4"
                                />
                              </svg>
                            </button>
                            <input
                              type="text"
                              className="bg-white rounded-lg text-center shadow focus:outline-none focus:shadow-lg text-sm"
                              value={item.qty}
                              readOnly
                            />
                            <button
                              onClick={() => addQty(item, 1)}
                              className="rounded-lg text-center py-1 text-white bg-[#546E7a] hover:bg-[#455A64] focus:outline-none"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-3 inline-block"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="select-none h-auto w-full text-center pt-3 pb-4 px-4">
                <div className="flex mb-3 text-lg font-semibold text-blue-gray-700">
                  <div>TOTAL</div>
                  <div className="text-right w-full">
                    {priceFormat(getTotalPrice())}
                  </div>
                </div>
                <div className="mb-3 text-blue-gray-700 px-3 pt-2 pb-3 rounded-lg bg-[#ECEFF1]">
                  <div className="flex text-lg font-semibold">
                    <div className="flex-grow text-left">CASH</div>
                    <div className="flex text-right">
                      <div className="mr-2">Rp</div>
                      <input
                        value={numberFormat(cash)}
                        onChange={(e) => updateCash(e.target.value)}
                        type="text"
                        className="w-28 text-right bg-white shadow rounded-lg focus:bg-white focus:shadow-lg px-2 focus:outline-none"
                      />
                    </div>
                  </div>
                  <hr className="my-2 border-[#b0bec5]" />
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {[2000, 5000, 10000, 20000, 50000, 100000].map((item) => (
                      <button
                        key={item}
                        className="bg-white rounded-lg shadow hover:shadow-lg focus:outline-none inline-block px-2 py-1 text-sm"
                        onClick={() => addCash(item)}
                      >
                        +<span>{numberFormat(item)}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className={`flex mb-3 text-lg font-semibold ${change < 0 ? "bg-pink-50" : "bg-cyan-50"} rounded-lg py-2 px-3`}>
                  <div className={`${change < 0 ? "text-pink-500" : "text-cyan-800"}`}>CHANGE</div>
                  <div className={`text-right flex-grow ${change < 0 ? "text-pink-400" : "text-cyan-600"}`}>
                    {priceFormat(change)}
                  </div>
                </div>
                <button
                  className={`text-white rounded-2xl text-lg w-full py-3 focus:outline-none 
              ${isSubmitable
                      ? "bg-cyan-500 hover:bg-cyan-600"
                      : "bg-[#b0bec5]"
                    }`}
                  disabled={!isSubmitable}
                  onClick={submit}
                >
                  SUBMIT
                </button>
              </div>
            </div>
          </div>
        </div>

        {isShowModalReceipt ? (
          <div
            className="fixed w-full h-screen left-0 top-0 z-10 flex flex-wrap justify-center content-center p-24"
          >

            <div
              className="fixed bg-[rgba(100,120,130,0.6)] backdrop-blur-[10px] p-4 w-full h-screen left-0 top-0 z-0" onClick={() => setIsShowModalReceipt(false)}
            ></div>

            <div
              className="w-96 rounded-3xl bg-white shadow-xl overflow-hidden z-10"
            >
              <div id="receipt-content" className="text-left w-full text-sm p-6 overflow-auto">
                <div className="text-center">
                  <img src="img/receipt-logo.png" alt="Tailwind POS" className="mb-3 w-8 h-8 inline-block" />
                  <h2 className="text-xl font-semibold">TAILWIND POS</h2>
                  <p>CABANG KONOHA SELATAN</p>
                </div>
                <div className="flex mt-4 text-xs">
                  <div className="flex-grow">No: <span>{receiptNo}</span></div>
                  <div>{receiptDate}</div>
                </div>
                <hr className="my-2 border-[#b0bec5]" />
                <div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr>
                        <th className="py-1 w-1/12 text-center">#</th>
                        <th className="py-1 text-left">Item</th>
                        <th className="py-1 w-2/12 text-center">Qty</th>
                        <th className="py-1 w-3/12 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item, index) => (
                        <tr key={index}>
                          <td className="py-2 text-center">{index + 1}</td>
                          <td className="py-2 text-left">
                            <span>{item.name}</span>
                            <br />
                            <small>{priceFormat(item.price)}</small>
                          </td>
                          <td className="py-2 text-center">{item.qty}</td>
                          <td className="py-2 text-right">{priceFormat(item.qty * item.price)}</td>
                        </tr>
                      ))}

                    </tbody>
                  </table>
                </div>
                <hr className="my-2 border-[#b0bec5]" />
                <div>
                  <div className="flex font-semibold">
                    <div className="flex-grow">TOTAL</div>
                    <div>{priceFormat(getTotalPrice())}</div>
                  </div>
                  <div className="flex text-xs font-semibold">
                    <div className="flex-grow">PAY AMOUNT</div>
                    <div>{priceFormat(cash)}</div>
                  </div>
                  <hr className="my-2 border-[#b0bec5]" />
                  <div className="flex text-xs font-semibold">
                    <div className="flex-grow">CHANGE</div>
                    <div>{priceFormat(change)}</div>
                  </div>
                </div>
              </div>
              <div className="p-4 w-full">
                <button className="bg-cyan-500 text-white text-lg px-4 py-3 rounded-2xl w-full focus:outline-none" onClick={() => printAndProceed()}>PROCEED</button>
              </div>
            </div>


          </div>
        ) : (<></>)}

      </div>

      <div id="print-area" className="print-area"></div>
    </>
  );
}
