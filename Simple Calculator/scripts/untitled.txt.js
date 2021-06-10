var MathInitializer=math.evaluate('1+1'),
    tmp_editor_string=document.createElement('textarea'),
    regex=["+","-","*","/","(",")","^"],
    prev="Previous Answer: ",
    timer,
    longDuration=500
    
    
let history=[];
const parentView=document.getElementById("app");

//for looping the eqution returns the boolean
function Yharu_loop(inputView,whereToStart,whereToEnd,isIncrement)
{
    for(var srch=whereToStart;(isIncrement?srch<whereToEnd:srch>whereToEnd);(isIncrement?srch++:srch--))
        {
          var tmp=inputView.value.charAt(srch-(isIncrement?0:1));
            if(regex.indexOf(tmp)!=-1)
                return false;
            else if(tmp==".")
                return true;
        }
        return false;
}

//used for key of calculator
function Yharu_add(param,v=document.activeElement)
{
    var tmp_pos=v.selectionStart;
    param=param.getAttribute("value");
    if(param=='CLR')
    {
        tmp_pos=v.selectionStart-1<0?0:v.selectionStart-1;
        deleteAtCursor(v);
    }
    else if(param==".")
    {
        if(!Yharu_loop(v,v.selectionStart,0,false) && !Yharu_loop(v,v.selectionStart,v.value.length,true))
        {
            tmp_pos=v.selectionStart+1;
            addAtCursor(v,param);
        }
        
    }
    else if(param=="=")
    {
        var tmp=v.value;
        if(tmp.length>0)
        {
            if(history.length<=0||history[history.length-1]!==tmp)
                {
                    Yharu_Eval(tmp,document.getElementById('input_out'));
                    addEquation(document.getElementById('body-cntnr'),tmp)
                    history.push(tmp);
                }
    
      }
    }
    else
    {
        tmp_pos=v.selectionStart+1;
        addAtCursor(v,param);
    }
    PosCrsr(v,tmp_pos);
    
    //always scroll if adding character
//    document.getElementById("input").preventDefault();
    v.focus();
  //  v.focus();
    
}

//delete from current cursor/caret
function deleteAtCursor(myField)
{
    var tmp_str=myField.value;
    if(tmp_str.substring(myField.selectionStart-1,myField.selectionStart)=="("&&tmp_str.substring(myField.selectionEnd,myField.selectionEnd+1)==")")
    {
        myField.value=tmp_str.substring(0,myField.selectionStart-1)+tmp_str.substring(myField.selectionEnd+1,tmp_str.length);
    }
    else
    {
        myField.value=tmp_str.substring(0,myField.selectionStart-1)+tmp_str.substring(myField.selectionEnd,tmp_str.length);
    }
}

//adding text to current cursor/caret
function addAtCursor(myField, myValue,bools)
{
    //IE support
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
    } //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
    } else {
        myField.value += myValue;
    }
}

//positioning the cursor/caret
function PosCrsr(end,len) 
{ 
    // Mostly for Web Browsers 
    if (end.setSelectionRange) 
    { 
        end.focus();
        end.setSelectionRange(len, len);
    } //mostly used for other browser
    else if (end.createTextRange)
    {
        var t = end.createTextRange();
        t.collapse(true);
        t.moveEnd('character', len);
        t.moveStart('character', len); 
        t.select(); 
    } 
} 

   
//adding key for calc
function init()
{
    createAbout();
    createCalculator();
    createHistory();
    AddMenu();
    
}

function Yharu_parser(toParse)
{
    equation=toParse;
    
        var tmp_str=toParse;
        var tms=0;
        for(var i=0;i<tmp_str.length;i++)
        {
           switch (regex2.indexOf(tmp_str.charAt(i))) {
               case 0:
                   if(regex.indexOf(tmp_str.charAt(i-1))==-1||regex2.indexOf(tmp_str.charAt(i-1))==3)
                   {
                       equation=equation.substring(0,i-1+tms)+"*"+equation.substring(i+tms,tmp_str.length);
                       tms++;
                   }
                   break;
               case 1:
                   if(regex.indexOf(tmp_str.charAt(i+1))==-1||regex2.indexOf(tmp_str.charAt(i+1))==3)
                   {
                       equation=equation.substring(0,i+tms+1)+"*"+equation.substring(i+tms,tmp_str.length);
                       tms++;
                   }
                   break;
                case 2:
                       equation=equation.substring(0,i+tms)+"**"+equation.substring(i+1+tms,tmp_str.length);
                       tms++;
                    break;
                case 3:
                    console.log(2+tmp_str.charAt(i));
                    if(i+1>=tmp_str.length&&i<=0||regex.indexOf(tmp_str.charAt(i-1))!=-1 && regex.indexOf(tmp_str.charAt(i+1))!=-1)
                        equation=equation.substring(0,i+tms)+"0"+equation.substring(i+1+tms,equation.length);
                    break;
               default:
                   break;
           } 
        }
    return equation;
}


function createCalculator()
{
    //initialize the App
    parentView.setAttribute('class','App');
    var v=document.createElement('div');
    v.setAttribute('class','page calculator left');
    v.setAttribute('id','calculator')
    var header=document.createElement('div');
    header.setAttribute('class','header hd_cal');
    header.setAttribute('id','hed');
    v.appendChild(header);
    
    
    var menu_img = document.createElement('img');
    var menu=document.createElement('div');
    menu_img.setAttribute('class','menu_img');
    
    menu.setAttribute('class', 'menu');
    var list=document.createElement('div');
    list.setAttribute('class','menu_list');
    createPopup(menu,'try');
    header.appendChild(menu);

    var hd_ttl=document.createElement('h1');
    hd_ttl.innerHTML="CALCULATOR"
    header.appendChild(hd_ttl)
    var input_cntr=document.createElement('div')
    input_cntr.setAttribute('class','input_container')
    v.appendChild(input_cntr)
    var input=document.createElement('input')
    input.setAttribute('placeholder','0')
    input.setAttribute('class','input')
    input.setAttribute('inputmode','none')
    input.addEventListener('keypress',function(e)
    {
        if(e.key=="Enter")
        {
            var tmp=v.value;
            if(tmp.length>0)
            {
                if(history.length<=0||history[history.length-1]!==tmp)
                    {
                        Yharu_Eval(tmp,document.getElementById('input_out'));
                        addEquation(document.getElementById('body-cntnr'),tmp)
                        history.push(tmp);
                    }
            }
        }
        
    })
    input.setAttribute('type',"text")
    input.setAttribute('id','input')
    input_cntr.appendChild(input)
    var input_out=document.createElement('p')
    input_out.setAttribute('class','input_out')
    input_out.setAttribute('id','input_out')
    input_out.innerHTML=prev+0
    input_cntr.appendChild(input_out)
    var Key_cntnr=document.createElement('div')
    Key_cntnr.setAttribute('class','key_cntnr')
    
    v.appendChild(Key_cntnr);
    parentView.appendChild(v);
    
    
    for(var i=0;i<3;i++)
    {
        var cntr1=document.createElement('div');
        cntr1.setAttribute('class','cntr1 row'+i);
        Key_cntnr.appendChild(cntr1);
        if(i==0)
        {
            var t=["()","*","/","CLR"];
            for(var j=0;j<4;j++)
                {
                    const key=document.createElement('div');
                    cntr1.appendChild(key);
                    key.setAttribute('class','key operation '+(j==3?'clr':''));
                    key.setAttribute('value',t[j]);
                    key.innerHTML='<p class="key_num operation_num">'+t[j]+'</p>';
                    
                    key.addEventListener('click',function(){
                        Yharu_add(key,document.getElementById("input"))
                        });
                    if(j>=3)
                    {
                        
                        key.addEventListener('mouseup',function(){
                            onRelease()
                            console.log(1)
                        })
                        key.addEventListener('mousedown',function(){
                            onLong(input)
                            console.log(2)
                        })
                        
                        key.addEventListener('touchstart',function(){
                            onLong(input)
                        })
                        key.addEventListener('touchend',function(){
                            
                            onRelease()
                            
                        })
                        key.addEventListener('touchmove',function(){
                            onRelease()
                        })
                    }
                }
        }
        else if(i==1)
        {
            var main=document.createElement('div');
            main.setAttribute('class','cntr2 main');
            cntr1.appendChild(main);
            for(var j=0;j<2;j++)
            {
                var cntr2=document.createElement('div');
                
                main.appendChild(cntr2);
                if(j==0)
                {
                    cntr2.setAttribute('class','cntr2 number_');
                    var numb=1;
                    for(var k=0;k<3;k++)
                    {
                        var cnr=document.createElement('div');
                        cnr.setAttribute('class','cntr1 n'+k);
                        cntr2.appendChild(cnr);
                        for(var l=0;l<3;l++)
                        {
                            
                            const key=document.createElement('div');
                            cnr.appendChild(key);
                            key.setAttribute('class','key normal');
                            key.setAttribute('value',numb);
                            key.innerHTML='<p class="key_num operation_num">'+numb+'</p>';
                            key.addEventListener('click',function(){
                                Yharu_add(key,document.getElementById("input"))
                                });
                            numb++;
                        }
                    }
                }
                else
                {
                 var tmp=["^","-","+"];
                 
                    cntr2.setAttribute('class','cntr2 ops_');
                    for (var m = 0; m < 3; m++) {
                            const key=document.createElement('div');
                            key.setAttribute('class','key operation');
                            key.setAttribute('value',tmp[m]);
                            key.innerHTML='<p class="key_num operation_num">'+tmp[m]+'</p>';
                            key.addEventListener('click',function(){
                                Yharu_add(key,document.getElementById("input"))
                                });
                            cntr2.append(key);

                    }
                    
                }
                
            }
        }
        else if(i==2)
        {
            var tmp=[".","0","="];
            for (var m = 0; m < 3; m++) {
                const key = document.createElement('div');
                key.setAttribute('class', m!=2?'key normal':'key equal');
                key.setAttribute('value', tmp[m]);
                key.innerHTML = '<p class="key_num operation_num">' + tmp[m] + '</p>';
                key.addEventListener('click', function(){
                    Yharu_add(key,document.getElementById("input"))
                    });
                cntr1.append(key);
            
            }
            
            
        }
    
        
    }
}

function onLong(e)
{
    timer=setTimeout(function(){e.value=''},longDuration)
}
function onRelease()
{
    if(timer){
        clearTimeout(timer)
       
    }
   
}

function createHistory()
{
    var history=document.createElement('div'),
        headr = document.createElement('div'),
        menu=document.createElement('div'),
        hs_ttl = document.createElement('h1'),
        mainContainer=document.createElement('div');

    //initializing
    history.setAttribute('class','page history right');
    history.setAttribute('id','history');
    headr.setAttribute('class', 'header hd_his');
    history.appendChild(headr);
    menu.setAttribute('class','menu')
    createPopup(menu,'try1')
    headr.appendChild(menu);
    hs_ttl.innerHTML = "HISTORY";
    headr.appendChild(hs_ttl);
    mainContainer.setAttribute('class','m_history')
    mainContainer.setAttribute('id','body-cntnr')
    history.appendChild(mainContainer);
    parentView.appendChild(history);
}

function createAbout()
{
    var abt_cntnr=document.createElement('div'),
        abt_main=document.createElement('div'),
        header=document.createElement('div'),
        Title=document.createElement('h1'),
        close=document.createElement('div'),
        main=document.createElement('div')
        
        parentView.appendChild(abt_cntnr)
        abt_cntnr.appendChild(abt_main)
        abt_main.appendChild(header)
        abt_main.appendChild(main)
        header.appendChild(Title)
        header.appendChild(close)
        
       close.innerHTML="X"
   
       close.setAttribute('class','close')
        
        
        
        Title.innerHTML='ABOUT'
        Title.setAttribute('class','noTouch')
        header.setAttribute('class','header_abt noTouch')
        main.setAttribute('class','noTouch About_Content')
        abt_main.setAttribute('id','main_cntnt')
        abt_cntnr.setAttribute('class','noScroll')
        abt_cntnr.setAttribute('id','sisay')
      
        main.innerHTML='<p class="noTouch" style="text-align:center"><span class="noTouch" style="color:#f39c12"><span class="noTouch" style="font-size:24px"><strong class="noTouch">SIMPLE CALCULATOR</strong></span></span>&nbsp;</p>\
<hr class="noTouch" />\
<p class="noTouch">There is nothing Special, this is just a&nbsp;<strong class="noTouch">&quot;Simple Calculator&quot;.</strong></p>\
<hr class="noTouch" />\
<p class="noTouch"><strong class="noTouch"><span class="noTouch" style="font-size:16px">FEATURES:</span></strong></p>\
<ul class="noTouch" style="margin-left:40px">\
	<li class="noTouch">Dark and Light Mode</li>\
	<li class="noTouch">Responsive layout</li>\
	<li class="noTouch">Being &quot;Simple&quot;</li>\
</ul>\
<hr class="noTouch" />\
<p class="noTouch"><span class="noTouch" style="font-size:16px"><strong class="noTouch">LANGUAGE USED:</strong></span></p>\
<ul class="noTouch" style="margin-left:40px">\
	<li class="noTouch">HTML</li>\
	<li class="noTouch">CSS</li>\
	<li class="noTouch">JAVASCRIPT</li>\
</ul>\
<hr class="noTouch" />\
<p class="noTouch"><strong class="noTouch"><span class="noTouch" style="font-size:16px">IMAGE USED:</span></strong></p>\
<ul class="noTouch" style="margin-left:40px">\
	<li class="noTouch">GOOGLE MATERIAL ICON</li>\
	<li class="noTouch">STICKnoLOGIC (loading.gif, "no javascript enabled"/error.png)</li></ul>\
<hr class="noTouch" />\
<hr class="noTouch" />\
<p class="noTouch"><strong class="noTouch"><span class="noTouch" style="font-size:16px">LIBRARY USED:</span></strong></p>\
<ul class="noTouch" style="margin-left:40px">\
	<li class="noTouch">MathJS&nbsp;\
	<ul class="noTouch">\
		<li class="noTouch"><a class="noTouch" href="http://mathjs.org" target="_blank">Official Website</a></li>\
		<li class="noTouch"><a class="noTouch" href="https://github.com/josdejong/mathjs" target="_blank">Github Link</a></li>\
	</ul>\
	</li>\
</ul>\
<hr class="noTouch" />\
<p class="noTouch"><strong class="noTouch">AUTHOR\&#39;S TAUGHT:</strong></p>\
<p class="noTouch">Hello guys and co-devs(if you consider me a developer),I&#39;m just a beginner and this is my first website project so its not perfect, not stable and you can face some bugs. In that case please <a class="noTouch" href="https://github.com/STICKnoLOGIC/Simple-Calculator/issues" target="_blank">report it to us</a>&nbsp;and you can create a <a class="noTouch" href="https://github.com/STICKnoLOGIC/Simple-Calculator/pulls" target="_blank">&quot;Pull Request&quot;</a>&nbsp;for improvement.</p>\
<hr class="noTouch" />\
<p class="noTouch"><strong class="noTouch">F</strong><strong class="noTouch">UTURE PLAN:</strong></p>\
<ul class="noTouch">\
	<li class="noTouch">Optimize the code</li>\
	<li class="noTouch">Convert to Scientific calculator</li>\
</ul>\
<hr class="noTouch" />\
<p class="noTouch"><strong class="noTouch">KINDLY FOLLOW ME:</strong></p>\
<p class="noTouch"><strong class="noTouch" style="font-size:18px"><a class="noTouch" class="noTouch" href="https://facebook.com/STICKnoLOGIC" style="font-size: 18px;" target="_blank">👍Facebook</a>&nbsp;</strong><a class="noTouch" href="https://github.com/STICKnoLOGIC" style="" target="_blank"> <strong class="noTouch">🐙Github</strong></a></p>\
<hr class="noTouch" />\
<p class="noTouch"><strong class="noTouch">LICENSE:</strong></p>\
<p class="noTouch">STICKnoLOGIC/Simple-Calculator is licensed under the</p>\
<h3>MIT License</h3>\
<p class="noTouch">A short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code.</p>\
<p class="noTouch"><strong class="noTouch">Permissions</strong></p>\
<ul class="noTouch">\
	<li class="noTouch">&nbsp;Commercial use</li>\
	<li class="noTouch">&nbsp;Modification</li>\
	<li class="noTouch">&nbsp;Distribution</li>\
	<li class="noTouch">&nbsp;Private use</li>\
</ul>\
<p class="noTouch"><strong class="noTouch">Limitations</strong></p>\
<ul class="noTouch">\
	<li class="noTouch">&nbsp;Liability</li>\
	<li class="noTouch">&nbsp;Warranty</li>\
</ul>\
<p class="noTouch"><strong class="noTouch">Conditions</strong></p>\
<ul class="noTouch">\
	<li class="noTouch">&nbsp;License and copyright notice</li>\
</ul>\
<p class="noTouch">&nbsp;</p>'
   abt_main.setAttribute('class','Abouts noTouch')
   
        
}

function AddMenu()
{
    var cntnr=document.createElement('div'),
        swap=document.createElement('div'),
        dark=document.createElement('div'),
        about=document.createElement('div')
        
    swap.setAttribute('class','center-menu')
    dark.setAttribute('class','center-menu')
    about.setAttribute('class','center-menu')
    cntnr.setAttribute('class','hover')
    swap.setAttribute('id','switch')
    dark.setAttribute('id','tema')
    about.setAttribute('id','sino')
    dark.innerHTML='<img src="image/dark.png"class="desktop-menu"/>'
    swap.innerHTML='<img src="image/swap-d.png"class="desktop-menu"/>'
    about.innerHTML='<img src="image/about-d.png"class="desktop-menu"/>'
    
    dark.addEventListener('click',function()
        {
            //toggle darkmode/light

        //    menu.classList.toggle('dark-menu')
            toggleTheme()
         //dark.innerHTML=menu.classList.contains('dark-menu')?'Light':'Dark'
        });
        
        swap.addEventListener('click',function(){
            //switch between calculator or history
            var tmp=[document.getElementById('history'),document.getElementById('calculator')]
            
            for(var x=0;x<tmp.length;x++)
            {
                tmp[x].classList.toggle('left')
                tmp[x].classList.toggle('right')
            }
            
        });
        
        about.addEventListener('click',function()
        {
            //show about
            document.getElementById('sisay').classList.toggle('see')
        });
    
    
    cntnr.appendChild(dark)
    cntnr.appendChild(swap)
    cntnr.appendChild(about)
    parentView.appendChild(cntnr)
}

function createPopup(parent,id)
{
    //variables
    var image=document.createElement('img'),
        dark=document.createElement('h1'),
        swap=document.createElement('h1'),
        about=document.createElement('h1'),
        menu=document.createElement('div');
        
        //initializing
        image.setAttribute('class','menu_img')
        image.src='image/menu.png'
        menu.setAttribute('class','menu_list')
        menu.setAttribute('id',id)
        dark.setAttribute('id','selector')
        dark.setAttribute('class','theme')
        about.setAttribute('id','selector')
        about.setAttribute('class','about')
        swap.setAttribute('class','swap')
        swap.setAttribute('id','selector')
        dark.innerHTML='<img src="image/dark.png" alt="image" class="sel-img"/>&nbsp;Dark'
        swap.innerHTML='<img src="image/swap-d.png" alt="image" class="sel-img"/>&nbsp;Switch'
        about.innerHTML='<img src="image/about-d.png" alt="image" class="sel-img"/>&nbsp;About'
        
        //appending
        menu.appendChild(dark)
        menu.appendChild(swap)
        menu.appendChild(about)
        parent.appendChild(menu)
        parent.appendChild(image)
        
        //add listener
        image.addEventListener('click',function()
        {
            menu.classList.toggle('show')
        })
        dark.addEventListener('click',function()
        {
            //toggle darkmode/light
            menu.classList.toggle('show')
        //    menu.classList.toggle('dark-menu')
            toggleTheme()
         //dark.innerHTML=menu.classList.contains('dark-menu')?'Light':'Dark'
        });
        
        swap.addEventListener('click',function(){
            //switch between calculator or history
            var tmp=[document.getElementById('history'),document.getElementById('calculator')]
            
            for(var x=0;x<tmp.length;x++)
            {
                tmp[x].classList.toggle('left')
                tmp[x].classList.toggle('right')
            }
            menu.classList.toggle('show')
        });
        
        about.addEventListener('click',function()
        {
            //show about
            document.getElementById('sisay').classList.toggle('see')
        });
}

function toggleTheme()
{
    var heads=document.getElementsByClassName('header'),
        text=document.getElementsByClassName('normal'),
        operation=document.getElementsByClassName('operation'),
        equal=document.getElementsByClassName('equal'),
        clr=document.getElementsByClassName('clr'),
        container=document.getElementsByClassName('key_cntnr'),
        h=document.querySelectorAll('h1'),
        menus=document.getElementsByClassName('menu_list'),
        themes=document.getElementsByClassName('theme'),
        items=document.getElementsByClassName('items'),
        equations=document.getElementsByClassName('equation'),
        swaps=document.getElementsByClassName('swap'),
        abouts=document.getElementsByClassName('about'),
        i=0
        
    parentView.classList.toggle('dark-parent')
    document.getElementById('input').classList.toggle('dark-input')
    
    for(i=0;i<heads.length;i++)
        heads[i].classList.toggle('dark-head')
    for (i = 0; i < text.length; i++)
       text[i].classList.toggle('dark-normal')
    for (i = 0; i < operation.length; i++)
        operation[i].classList.toggle('dark-operation')
    for (i = 0; i < equal.length; i++) 
        equal[i].classList.toggle('dark-equal')
    for (i = 0; i < clr.length; i++) 
        clr[i].classList.toggle('dark-clr')
    for (i = 0; i < container.length; i++)
        container[i].classList.toggle('dark-container')
    for (i = 0; i < h.length; i++)
        h[i].classList.toggle('dark-h')
    for(i=0;i<menus.length;i++)
        {
            menus[i].classList.toggle('dark-menu')
            themes[i].innerHTML=menus[i].classList.contains('dark-menu')?'<img src="image/light.png" alt="image" class="sel-img"/>&nbsp;Light':'<img src="image/dark.png" alt="image" class="sel-img"/>&nbsp;Dark'
            swaps[i].innerHTML='<img src="image/'+(menus[i].classList.contains('dark-menu')?'swap-l.png':'swap-d.png')+'" alt="image" class="sel-img"/>&nbsp;Switch'
            abouts[i].innerHTML='<img src="image/'+(menus[i].classList.contains('dark-menu')?'about-l.png':'about-d.png')+'" alt="image" class="sel-img"/>&nbsp;About'
        }
    for(i=0;i<items.length;i++)
        items[i].classList.toggle('dark-items')
    for(i=0;i<equations.length;i++)
        equations[i].classList.toggle('dark-equations')
    document.getElementById('tema').innerHTML='<img src="image/'+(parentView.classList.contains('dark-parent')?'light':'dark')+'.png" class="desktop-menu"/>'
    document.getElementById('sino').innerHTML='<img src="image/about-'+(parentView.classList.contains('dark-parent')?'l':'d')+'.png" class="desktop-menu"/>'
    document.getElementById('switch').innerHTML='<img src="image/swap-'+(parentView.classList.contains('dark-parent')?'l':'d')+'.png" class="desktop-menu"/>'
    document.getElementById('main_cntnt').classList.toggle('dark-menu')
}

function addEquation(Parent,Exp)
{
    var body=document.createElement('div'),
        equation=document.createElement('p'),
        copy=document.createElement('p'),
        Ans=document.createElement('p')
        
        
        equation.setAttribute('class','equation'+(document.getElementById('app').classList.contains('dark-parent')?' dark-equations':''))
        copy.setAttribute('class','copy')
        copy.addEventListener('click',function()
        {
            Yharu_Copy("Expression: "+Exp+"\nAnswer: "+Ans.innerHTML)
        })
        copy.innerHTML='<img src="image/copy.png" alt="image" class="side-img"/>&nbsp;COPY'
        equation.innerHTML=Exp
        Ans.setAttribute('class','answer')
        Yharu_Eval(Exp,Ans)
        body.setAttribute('class','items'+(document.getElementById('app').classList.contains('dark-parent')?' dark-items':''))
        body.appendChild(copy)
        body.appendChild(equation)
        body.appendChild(Ans)
        Parent.appendChild(body)
}

function Yharu_Eval(exp,output) {
    var reg = /(?:[a-z$_][a-z0-9$_]*)|(?:[;={}\[\]"'!&<>\\?:])/ig,
        err=true;
        
  
      if(reg.test(exp))
      {
        err=false;
      }
    


    // Don't evaluate if our replace function flagged as invalid
        if(err)
        {
            try { 
                tmp=math.evaluate(exp)
               if(output.classList.contains('error_out'))
               output.classList.toggle('error_out');
                output.innerHTML =math.round(tmp,15);
            }
           catch (e) {
                onError(output);
            }
        }
        else
          onError(output);
}

function Yharu_Copy(String)
{
    document.body.appendChild(tmp_editor_string)
    tmp_editor_string.value=String
    tmp_editor_string.select();
    document.execCommand("copy");
    document.body.removeChild(tmp_editor_string)
}

function onError(output)
{
    if(!output.classList.contains('error_out'))
    {
    output.classList.toggle('error_out');
    output.innerHTML='Syntax Error';
    }
}




window.onload=function(e){
    setTimeout(function() {
        document.getElementById('progress').classList.toggle('prog2')
        setTimeout(function(){
            document.getElementById('loader').classList.toggle('see')
            init()
        },500);
    },3000)
}

window.onclick=function(e)
{
    try{
    if (document.getElementById('try').classList.contains('show')&&!e.target.matches('.menu_img'))
    {
        document.getElementById('try').classList.toggle('show')
    }
    else if (document.getElementById('try1').classList.contains('show') && !e.target.matches('.menu_img'))
     {
         document.getElementById('try1').classList.toggle('show')
     }
     else if (document.getElementById('sisay').classList.contains('see') && !e.target.matches('.menu_img')&&!e.target.matches('.desktop-menu')&&!e.target.matches('.noTouch'))
     {
         document.getElementById('sisay').classList.toggle('see')
     }
        }catch(e){/*silently fail*/}
}
