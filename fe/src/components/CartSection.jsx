function CartSection({
  isMember
}) {
  const items = [
    {
      name: "Milk",
      price: 10000
    },
    {
      name: "Bread",
      price: 15000
    },
    {
      name: "Coffee",
      price: 20000
    }
  ];
  const subtotal =
    items.reduce(
      (acc, item) =>
        acc + item.price,
      0
    );
  const discount =
    isMember
      ? subtotal * 0.1
      : 0;
  const total =
    subtotal - discount;
  return (
    <div className="
      bg-white
      rounded-3xl
      p-6
      shadow-2xl
      h-full
    ">
      <h2 className="
        text-3xl
        font-bold
        mb-6
      ">
        Shopping Cart
      </h2>
      <div className="
        space-y-4
      ">
        {
          items.map(
            (item, index) => (
              <div
                key={index}
                className="
                  flex
                  justify-between
                  text-lg
                "
              >
                <span>
                  {item.name}
                </span>
                <span>
                  Rp
                  {item.price.toLocaleString()}
                </span>
              </div>
            )
          )
        }
      </div>
      <div className="
        border-t
        mt-8
        pt-6
        space-y-3
      ">
        <div className="
          flex
          justify-between
        ">
          <span>Subtotal</span>
          <span>
            Rp
            {subtotal.toLocaleString()}
          </span>
        </div>
        <div className="
          flex
          justify-between
          text-emerald-600
          font-semibold
        ">
          <span>Discount</span>
          <span>
            - Rp
            {discount.toLocaleString()}
          </span>
        </div>
        <div className="
          flex
          justify-between
          text-2xl
          font-bold
          mt-4
        ">
          <span>Total</span>
          <span>
            Rp
            {total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartSection;