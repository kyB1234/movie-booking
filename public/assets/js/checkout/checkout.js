const handleSeatBooking = () => {
    const form = document.createElement("form");
    const purchaseSummary = document.createElement("input");

    form.method = "POST";
    form.action = `/ticket`;

    purchaseSummary.value = JSON.stringify(checkoutObject);
    purchaseSummary.type = 'hidden'
    purchaseSummary.name = "Purchase Summary";
    form.appendChild(purchaseSummary);
    document.body.appendChild(form);

    form.submit();
}
