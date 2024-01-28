const mealContainer = $("#mealContainer");
const searchContainerElement = $("#searchContainer");
let submitBtn = $("#submitBtn");


$(document).ready(() => {
    fetchMealsByName("").then(() => {
        hideLoadingScreen();
        enableBodyOverflow();
    });
});

function openSideNavigation() {
    $(".side-nav-menu").animate({
        left: 0
    }, 500);

    $(".open-close-icon").removeClass("fa-align-justify").addClass("fa-x");

    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({
            top: 0
        }, (i + 5) * 100);
    }
}

function closeSideNavigation() {
    let boxWidth = $(".side-nav-menu .nav-tab").outerWidth();
    $(".side-nav-menu").animate({
        left: -boxWidth
    }, 500);

    $(".open-close-icon").addClass("fa-align-justify").removeClass("fa-x");

    $(".links li").animate({
        top: 300
    }, 500);
}

closeSideNavigation();

$(".side-nav-menu i.open-close-icon").click(() => {
    if ($(".side-nav-menu").css("left") === "0px") {
        closeSideNavigation();
    } else {
        openSideNavigation();
    }
});

function displayMealCards(meals) {
    let mealCardsHTML = "";

    for (let i = 0; i < meals.length; i++) {
        mealCardsHTML += `
        <div class="col-md-3">
            <div onclick="fetchMealDetails('${meals[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${meals[i].strMealThumb}" alt="" srcset="">
                <div class="meal-layer position-absolute d-flex align-items-center justify-content-center  text-white p-2">
                    <h3>${meals[i].strMeal}</h3>
                </div>
            </div>
        </div>`;
    }

    mealContainer.html(mealCardsHTML);
}

async function fetchCategories() {
    mealContainer.html("");
    showLoadingScreen();

    searchContainerElement.html("");

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    response = await response.json();

    displayCategories(response.categories);
    hideLoadingScreen();
}

function displayCategories(categoryList) {
    let categoriesHTML = "";

    for (let i = 0; i < categoryList.length; i++) {
        categoriesHTML += `
        <div class="col-md-3">
            <div onclick="fetchCategoryMeals('${categoryList[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${categoryList[i].strCategoryThumb}" alt="" srcset="">
                <div class="meal-layer position-absolute text-center text-black p-2">
                    <h3>${categoryList[i].strCategory}</h3>
                    <p>${categoryList[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
            </div>
        </div>`;
    }

    mealContainer.html(categoriesHTML);
}

async function fetchAreas() {
    mealContainer.html("");
    showLoadingScreen();

    searchContainerElement.html("");

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    response = await response.json();

    displayAreas(response.meals);
    hideLoadingScreen();
}

function displayAreas(areaList) {
    let areasHTML = "";

    for (let i = 0; i < areaList.length; i++) {
        areasHTML += `
        <div class="col-md-3">
            <div onclick="fetchAreaMeals('${areaList[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${areaList[i].strArea}</h3>
            </div>
        </div>`;
    }

    mealContainer.html(areasHTML);
}

async function fetchIngredients() {
    mealContainer.html("");
    showLoadingScreen();

    searchContainerElement.html("");

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    response = await response.json();

    displayIngredients(response.meals.slice(0, 20));
    hideLoadingScreen();
}

function displayIngredients(ingredientList) {
    let ingredientsHTML = "";

    for (let i = 0; i < ingredientList.length; i++) {
        ingredientsHTML += `
        <div class="col-md-3">
            <div onclick="fetchIngredientMeals('${ingredientList[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${ingredientList[i].strIngredient}</h3>
                <p>${ingredientList[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
            </div>
        </div>`;
    }

    mealContainer.html(ingredientsHTML);
}

async function fetchCategoryMeals(category) {
    mealContainer.html("");
    showLoadingScreen();

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    response = await response.json();

    displayMealCards(response.meals.slice(0, 20));
    hideLoadingScreen();
}

async function fetchAreaMeals(area) {
    mealContainer.html("");
    showLoadingScreen();

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    response = await response.json();

    displayMealCards(response.meals.slice(0, 20));
    hideLoadingScreen();
}

async function fetchIngredientMeals(ingredient) {
    mealContainer.html("");
    showLoadingScreen();

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    response = await response.json();

    displayMealCards(response.meals.slice(0, 20));
    hideLoadingScreen();
}

async function fetchMealDetails(mealID) {
    closeSideNavigation();
    mealContainer.html("");
    showLoadingScreen();

    searchContainerElement.html("");
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    response = await response.json();

    displayMealDetails(response.meals[0]);
    hideLoadingScreen();
}

function displayMealDetails(meal) {
    searchContainerElement.html("");

    let ingredientsHTML = "";

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredientsHTML += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`;
        }
    }

    let tags = meal.strTags?.split(",") || [];
    let tagsHTML = '';

    for (let i = 0; i < tags.length; i++) {
        tagsHTML += `<li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
    }

    let mealDetailsHTML = `
    <div class="col-md-4">
        <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
        <h2>${meal.strMeal}</h2>
    </div>
    <div class="col-md-8">
        <h2>Instructions</h2>
        <p>${meal.strInstructions}</p>
        <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
        <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
        <h3>Recipes :</h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${ingredientsHTML}
        </ul>
        <h3>Tags :</h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${tagsHTML}
        </ul>
        <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
        <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
    </div>`;

    mealContainer.html(mealDetailsHTML);
}

function showSearchInputs() {
    searchContainerElement.html(`
    <div class="row py-4">
        <div class="col-md-6">
            <input onkeyup="fetchMealsByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchMealsByFirstLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
    </div>`);

    mealContainer.html("");
}

async function fetchMealsByName(term) {
    closeSideNavigation();
    mealContainer.html("");
    showLoadingScreen();

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
    response = await response.json();

    response.meals ? displayMealCards(response.meals) : displayMealCards([]);
    hideLoadingScreen();
}

async function searchMealsByFirstLetter(term) {
    closeSideNavigation();
    mealContainer.html("");
    showLoadingScreen();

    term === "" ? term = "a" : "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`);
    response = await response.json();

    response.meals ? displayMealCards(response.meals) : displayMealCards([]);
    hideLoadingScreen();
}

function showLoadingScreen() {
    $(".inner-loading-screen").fadeIn(300);
}

function hideLoadingScreen() {
    $(".inner-loading-screen").fadeOut(300);
}

function enableBodyOverflow() {
    $("body").css("overflow", "visible");
}

function showContacts() {
    // Assuming rowData is declared and assigned elsewhere in your code
    // rowData.innerHTML = ...; // Keep this line if rowData is part of your existing code
    let formHtml=`<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `
mealContainer.html(formHtml)
    let nameInputTouched = false;
    let emailInputTouched = false;
    let phoneInputTouched = false;
    let ageInputTouched = false;
    let passwordInputTouched = false;
    let repasswordInputTouched = false;

    $("#nameInput").on("focus", function() {
        nameInputTouched = true;
    });

    $("#emailInput").on("focus", function() {
        emailInputTouched = true;
    });

    $("#phoneInput").on("focus", function() {
        phoneInputTouched = true;
    });

    $("#ageInput").on("focus", function() {
        ageInputTouched = true;
    });

    $("#passwordInput").on("focus", function() {
        passwordInputTouched = true;
    });

    $("#repasswordInput").on("focus", function() {
        repasswordInputTouched = true;
    });

    $("input").on("keyup", inputsValidation);

    function inputsValidation() {
        if (nameInputTouched) {
            $("#nameAlert").toggleClass("d-block d-none", nameValidation());
        }
        if (emailInputTouched) {
            $("#emailAlert").toggleClass("d-block d-none", emailValidation());
        }
        if (phoneInputTouched) {
            $("#phoneAlert").toggleClass("d-block d-none", phoneValidation());
        }
        if (ageInputTouched) {
            $("#ageAlert").toggleClass("d-block d-none", ageValidation());
        }
        if (passwordInputTouched) {
            $("#passwordAlert").toggleClass("d-block d-none", passwordValidation());
        }
        if (repasswordInputTouched) {
            $("#repasswordAlert").toggleClass("d-block d-none", repasswordValidation());
        }

        let isFormValid = (
            nameValidation() &&
            emailValidation() &&
            phoneValidation() &&
            ageValidation() &&
            passwordValidation() &&
            repasswordValidation()
        );

        submitBtn.prop("disabled", !isFormValid);
    }

    function nameValidation() {
        return (/^[a-zA-Z ]+$/.test($("#nameInput").val()));
    }

    function emailValidation() {
        return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($("#emailInput").val()));
    }

    function phoneValidation() {
        return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test($("#phoneInput").val()));
    }

    function ageValidation() {
        return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test($("#ageInput").val()));
    }

    function passwordValidation() {
        return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test($("#passwordInput").val()));
    }

    function repasswordValidation() {
        return $("#repasswordInput").val() === $("#passwordInput").val();
    }
}