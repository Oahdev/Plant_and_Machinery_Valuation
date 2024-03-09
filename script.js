function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function get_valuation(){
    var val_type = $("#val-type").val();
    $("section").hide();
    $("table").hide();
    $("."+val_type).show();
}

function sL_method(){
    var current_cost = parseInt($("#current-cost-sL").val());
    var salvage = parseInt($("#salvage-sL").val());
    var economic_life = parseInt($("#economic-life-sL").val());
    //get deprciation amount
    var depreciation = (current_cost - salvage) / (economic_life);
    var output = "";
    var value_begin_year = [];
    for (let i = 1; i < (economic_life+1); i++) {
        if(value_begin_year.length == 0){
            value_begin_year.push(current_cost);
        }else{
            var array_index = value_begin_year.length - 1;
            var value = value_begin_year[array_index];
            var book_value =  value - depreciation;
            value_begin_year.push(book_value);
        }
    }
    for (let i = 1; i < (economic_life+1); i++) {
        output += "<tr>"+
        "<td>"+i+"</td>"+
        "<td>"+numberWithCommas(value_begin_year[(i-1)].toFixed(0))+"</td>"+
        "<td>"+numberWithCommas(depreciation.toFixed(0))+"</td>"+
        "<td>"+numberWithCommas(((value_begin_year[(i-1)]) - depreciation).toFixed(0))+"</td>"+
        "</tr>"
    }
    $("table").show();
    $("#response").html(output);
}

function dB_method(){
    var current_cost = parseInt($("#current-cost-dB").val());
    var economic_life = parseInt($("#economic-life-dB").val());
    var db_type = parseInt($("#dB-type").val());
    //get deprciation rate
    var depreciation_rate = (1/economic_life) * db_type;
    var output = "";
    var value_begin_year = [];
    for (let i = 1; i < (economic_life+1); i++) {
        if(value_begin_year.length == 0){
            value_begin_year.push(current_cost);
        }else{
            var array_index = value_begin_year.length - 1;
            var value = value_begin_year[array_index];
            var book_value =  value-(value * depreciation_rate);
            value_begin_year.push(book_value.toFixed(0));
        }
    }
    for (let i = 1; i < (economic_life+1); i++) {
        output += "<tr>"+
        "<td>"+i+"</td>"+
        "<td>"+numberWithCommas(value_begin_year[(i-1)])+"</td>"+
        "<td>"+numberWithCommas(((value_begin_year[(i-1)]) * depreciation_rate).toFixed(0))+"</td>"+
        "<td>"+numberWithCommas(((value_begin_year[(i-1)]) - (value_begin_year[(i-1)] * depreciation_rate)).toFixed(0))+"</td>"+
        "</tr>"
    }
    $("table").show();
    $("#response").html(output);
}

function soY_method(){
    var current_cost = parseInt($("#current-cost-soY").val());
    var economic_life = parseInt($("#economic-life-soY").val());
    if($("#salvage-soY").val() == ""){
        var salvage = 0;
    }else{
        var salvage = parseInt($("#salvage-soY").val());
    }
    //get deprciation rate
    sum_of_years = (economic_life * (economic_life + 1))/2;
    var output = "";
    var value_begin_year = [];
    for (let i = 1; i < (economic_life+1); i++) {
        if(value_begin_year.length == 0){
            value_begin_year.push(current_cost);
        }else{
            var array_index = value_begin_year.length - 1;
            var value = value_begin_year[array_index];
            var life = (economic_life - i) +2;
            var book_value =  value - ((life/sum_of_years) * (current_cost - salvage));
            value_begin_year.push(book_value.toFixed(0));
        }
    }
    for (let i = 1; i < (economic_life+1); i++) {
        var life_dis = (economic_life - i) +1;
        var depreciation_dis = (life_dis/sum_of_years) * (current_cost - salvage);
        output += "<tr>"+
        "<td>"+i+"</td>"+
        "<td>"+numberWithCommas(value_begin_year[(i-1)])+"</td>"+
        "<td>"+numberWithCommas(depreciation_dis.toFixed(0))+"</td>"+
        "<td>"+numberWithCommas(((value_begin_year[(i-1)]) - depreciation_dis).toFixed(0))+"</td>"+
        "</tr>"
    }
    $("table").show();
    $("#response").html(output);
}

function sF_method(){
    var current_cost = parseInt($("#current-cost-sF").val());
    if($("#salvage-sF").val() == ""){
        var salvage = 0;
    }else{
        var salvage = parseInt($("#salvage-sF").val());
    }
    var economic_life = parseInt($("#economic-life-sF").val());
    var interest_rate = parseInt($("#interest-rate-sF").val());
    var interest_rate = interest_rate / 100;
    //get sinking fund
    var sf_top = interest_rate;
    var sf_bottom = (Math.pow((1+interest_rate),economic_life)) - 1;
    var sf = sf_top / sf_bottom;
    var sf = sf * (current_cost - salvage);
    //get AA
    function get_aa(i,n,sf){
        var aa_top = (Math.pow((1+i),n)) - 1;
        var aa_bottom = i;
        var aa = aa_top / aa_bottom;
        var new_amount = sf * aa;
        return new_amount;
    }
    var output = "";
    var value_begin_year = [];
    for (let i = 1; i < (economic_life+1); i++) {
        if(value_begin_year.length == 0){
            var book_value = get_aa(interest_rate,i,sf);
            value_begin_year.push(book_value.toFixed(0));
        }else{
            var book_value = get_aa(interest_rate,i,sf);
            value_begin_year.push(book_value.toFixed(0));
        }
    }
    for (let i = 1; i < (economic_life+1); i++) {
        output += "<tr>"+
        "<td>"+i+"</td>"+
        "<td>"+numberWithCommas(current_cost)+"</td>"+
        "<td>"+numberWithCommas((get_aa(interest_rate,i,sf)).toFixed(0))+"</td>"+
        "<td>"+numberWithCommas((current_cost - (get_aa(interest_rate,i,sf))).toFixed(0))+"</td>"+
        "</tr>"
    }
    $("table").show();
    $("#response").html(output);
}

