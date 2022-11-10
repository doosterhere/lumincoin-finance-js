(function () {
    const buttonMain = document.getElementById('buttonMain');
    const buttonBalance = document.getElementById('buttonBalance');
    const buttonCategories = document.getElementById('buttonCategories');
    const buttonIncomes = document.getElementById('buttonIncomes');
    const buttonExpenses = document.getElementById('buttonExpenses');
    const subMenu = document.getElementById('collapse');
    const bsCollapse = new bootstrap.Collapse(subMenu, {
        toggle: false
    });

    buttonMain.addEventListener('click', () => {
        buttonBalance.classList.remove('active');
        buttonCategories.classList.remove('active');
        buttonCategories.classList.add('collapsed');
        if (subMenu.classList.contains('show')) bsCollapse.toggle();
        buttonIncomes.parentElement.classList.remove('active');
        buttonExpenses.parentElement.classList.remove('active');
        buttonMain.classList.add('active');
    });

    buttonBalance.addEventListener('click', () => {
        buttonMain.classList.remove('active');
        buttonCategories.classList.remove('active');
        buttonCategories.classList.add('collapsed');
        if (subMenu.classList.contains('show')) bsCollapse.toggle();
        buttonIncomes.parentElement.classList.remove('active');
        buttonExpenses.parentElement.classList.remove('active');
        buttonBalance.classList.add('active');
    });

    buttonCategories.addEventListener('click', () => {
        if (buttonCategories.classList.contains('collapsed')) {
            setTimeout(() => {
                buttonCategories.classList.remove('rounded-0');
                buttonCategories.classList.remove('rounded-top');
                buttonCategories.classList.add('rounded');
            }, 200);
        }
        if (!buttonCategories.classList.contains('collapsed')) {
            buttonCategories.classList.remove('rounded');
            buttonCategories.classList.add('rounded-0');
            buttonCategories.classList.add('rounded-top');
        }
        buttonMain.classList.remove('active');
        buttonBalance.classList.remove('active');
        buttonCategories.classList.add('active');
    });

    buttonIncomes.addEventListener('click', () => {
        buttonExpenses.parentElement.classList.remove('active');
        buttonIncomes.parentElement.classList.add('active');
    });

    buttonExpenses.addEventListener('click', () => {
        buttonIncomes.parentElement.classList.remove('active');
        buttonExpenses.parentElement.classList.add('active');
    });
})()