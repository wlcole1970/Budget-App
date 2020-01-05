//immediate invoked function expressions IIFE

//BUDGET CONTROLLER

var budgetController = (function() {

    var Expense = function(id, description, value) {  /* capital letter denote function constructor*/
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;     


    };

    Expense.prototype.calcPercentage = function(totalIncome) {

        if (totalIncome > 0) {

        this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }

    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function(id, description, value) {  /* capital letter denote function constructor*/
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal = function(type) {

        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });

        data.totals[type] = sum;
    };

//GLOBAL DATA

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            //create new ID
            if (data.allItems[type].length > 0) {

                ID = data.allItems[type][data.allItems[type].length - 1].id +1;
            } else {
                ID = 0;
            }
           
            //recreate new item based on 'inc or 'exp' type
            if (type === 'exp') {

                newItem = new Expense(ID, des, val);

            } else if (type === 'inc') {

                newItem = new Income(ID, des, val);
            }
            // Push it into our data structure
            data.allItems[type].push(newItem);

            // return the new element
            return newItem;
        },

            deleteItem: function(type, id) {
                var ids, index;

                ids = data.allItems[type].map(function(current) {
                    return current.id;
                });

                index = ids.indexOf(id);

                if (index !== -1) {
                    data.allItems[type].splice(index, 1);

                }
            },

        calculateBudget: function(){

            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate budget (income - expenses)
            data.budget = data.totals.inc - data.totals.exp;

            //calculate % of income spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100 );
            } else {
                data.percentage = -1;
            }

        },
        
        calculatePercentages: function() {
            data.allItems.exp.forEach(function(cur) {
              cur.calcPercentage(data.totals.inc);  
            });

        },

        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function() {
            console.log(data);
        }
    };
    

})();

// UIController
var UIController = (function() {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentLabel: '.item__percentage'


    };

    return {
        getInput: function() {

            return {
                 type: document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
                 description: document.querySelector(DOMStrings.inputDescription).value,
                 value: parseFloat(document.querySelector(DOMStrings.inputValue).value), // parseFloar = turns number which is a string into a number
            };

        },

        addListItem: function(obj, type) {
            var html, newHtml;
            //create HTML string with placeholder text

            if (type === 'inc') {
            
                element = DOMStrings.incomeContainer;

            html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if (type === 'exp') {

                element = DOMStrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
         


            //replace the placehoilder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);



            //insert html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {
                var el = document.getElementById(selectorID);
                el.parentNode.removeChild(el);
        },

        clearFields: function() {

            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ' , ' + DOMStrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                    current.value = "";
            
                
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj) {
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;
            document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage;

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }

        },
        displayPercentages: function(percentages) {

            var fields = document.querySelectorAll(DOMStrings.expensesPercentLabel);

            var nodeListForEach = function(list, callback) {

                    for (var i = 0; i < list.length; i++) {
                        callback(list[i], i);
                    }
            };

        nodeListForEach(fields, function(current, index) {

            if (percentages[index] > 0) {
                current.textContent = percentages[index] + '%';
            } else {
            current.textContent = '---';
            }
        });
    },
        getDOMStrings: function() {
            return DOMStrings;
        }
    };

})();


//Global App Controller
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListerners = function() {

        var DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem) 
    
        // when user presses 'Return" key
    
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
    
            } 
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };
     
    var updateBudget = function() {


    // 1 Calculate the budget
    budgetCtrl.calculateBudget();

    // 2 Return the Budget
        var budget = budgetCtrl.getBudget();

    // 3 display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {

    // calculate percentages
    budgetCtrl.calculatePercentages();

    // read percentages from budget controller
    var percentages = budgetCtrl.getPercentages();

    // update UI with %'s
        UICtrl.displayPercentages(percentages);
    };
    
    // control add item function

    var ctrlAddItem = function() {
        var input, newItem;

    // 1 get the field input data

    input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

    
    // 2 add the item to the budget controller

            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    // 3 add the new item to UI

            UICtrl.addListItem(newItem, input.type);

    // 4 clear the fields

            UICtrl.clearFields();

     // 5 calculate and update budget    
            updateBudget();   
        

        // 6 calculate and update percentages

        updatePercentages();
        }
    };
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //1 delete item from data structure

            budgetCtrl.deleteItem(type, ID);

            //2 delete from UI

            UICtrl.deleteListItem(itemID);

            //3 Update and show the new budget
            updateBudget();

            // 4 update percentages

            updatePercentages();
        }
    };


    return {
        init: function() {
            
            console.log('Application has started.');
            UICtrl.displayBudget( {
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListerners();
        }
    };

  

})(budgetController, UIController);


controller.init();