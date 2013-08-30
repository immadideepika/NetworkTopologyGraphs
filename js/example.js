var labelType, useGradients, nativeTextSupport, animate;

(function() {
    var ua = navigator.userAgent,
        iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
        typeOfCanvas = typeof HTMLCanvasElement,
        nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
        textSupport = nativeCanvasSupport
            && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
    //I'm setting this based on the fact that ExCanvas provides text support for IE
    //and that as of today iPhone/iPad current text support is lame
    labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
    nativeTextSupport = labelType == 'Native';
    useGradients = nativeCanvasSupport;
    animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
    elem: false,
    write: function(text){
        if (!this.elem)
            this.elem = document.getElementById('log');
        this.elem.innerHTML = text;
        this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
    }
};


function init(){
    console.log(new Date());


   /*
    $jit.ForceDirected.Plot.NodeTypes.implement({
        'customNode': {
            'render': function (node, canvas) {
                var img = new Image(),
                    pos = node.pos.getc(true),
                    ctx = canvas.getCtx();

                img.onload = function () {
                    ctx.drawImage(img, pos.x - 15, pos.y - 15);
                };

                img.src = '../screenIcon.PNG';
            }
        }

    });   */
    // init data
    // init ForceDirected
    var fd = new $jit.ForceDirected({
        //id of the visualization container
        injectInto: 'infovis',
        //Enable zooming and panning
        //by scrolling and DnD
        Navigation: {
            enable: true,
            //Enable panning events only if we're dragging the empty
            //canvas (and not a node).
            panning: 'avoid nodes',
            zooming: 10 //zoom speed. higher is more sensible
        },
        // Change node and edge styles such as
        // color and width.
        // These properties are also set per node
        // with dollar prefixed data-properties in the
        // JSON structure.
        Node: {
            overridable: true ,
            color:'#FF97D5',
            type: 'customNode',
            dim: 5
        },
        Edge: {
            overridable: true,
            color: '#23A4FF',
            lineWidth: 0.6 ,
            type:'arrow'

        },
        //Native canvas text styling
        Label: {
            type: labelType, //Native or HTML
            size: 10,
            style: 'bold',
            color:'#fff'
        },
        //Add Tips
        Tips: {
            enable: true,
            onShow: function(tip, node) {
                //count connections
                var count = 0;
                node.eachAdjacency(function() { count++; });
                //display node info in tooltip
                tip.innerHTML = "<div class=\"tip-title\">" + node.name + "</div>"
                    + "<div class=\"tip-text\"><b>connections:</b> " + count + "</div>";
            }
        },

        // Add node events
        Events: {
            enable: true,
            type: 'Native',
            //Change cursor style when hovering a node
            onMouseEnter: function() {
                fd.canvas.getElement().style.cursor = 'move';
            },
            onMouseLeave: function() {
                fd.canvas.getElement().style.cursor = '';
            },
            //Update node positions when dragged
            onDragMove: function(node, eventInfo, e) {
                var pos = eventInfo.getPos();
                node.pos.setc(pos.x, pos.y);
                fd.plot();
            },
            //Implement the same handler for touchscreens
            onTouchMove: function(node, eventInfo, e) {
                $jit.util.event.stop(e); //stop default touchmove event
                this.onDragMove(node, eventInfo, e);
            },
            //Add also a click handler to nodes
            onClick: function(node) {
                if(!node) return;
                // Build the right column relations list.
                // This is done by traversing the clicked node connections.
                var html = "<h4>" + node.name + "</h4><b> connections:</b><ul><li>",
                    list = [];
                node.eachAdjacency(function(adj){
                    list.push(adj.nodeTo.name);
                });
                //append connections information
                $jit.id('inner-details').innerHTML = html + list.join("</li><li>") + "</li></ul>";
            }
        },
        //Number of iterations for the FD algorithm
        iterations: 200,
        //Edge length
        levelDistance: 130,
        // Add text to the labels. This method is only triggered
        // on label creation and only for DOM labels (not native canvas ones).
        onCreateLabel: function(domElement, node){
            domElement.innerHTML =  node.name;
            var style = domElement.style;
            style.fontSize = "0.8em";
            style.color = "#ddd";
        },



        // Change node styles when DOM labels are placed
        // or moved.
        onPlaceLabel: function(domElement, node){
            var style = domElement.style;
            var left = parseInt(style.left);
            var top = parseInt(style.top);
            var w = domElement.offsetWidth;
            style.left = (left - w / 2) + 'px';
            style.top = (top + 10) + 'px';
            style.display = '';
        }
    });
    // load JSON data.


    console.log($('#Node-Select')  );
    $('#Node-Select').change(function(){
        if(this.value == '100')
        {
            fd.loadJSON(window.graphJsonHundred);
            caliculatePositions();
            fd.plot();
        }
        if(this.value == '200')
        {
            fd.loadJSON(window.graphJsonTwoHundred);
            caliculatePositions();
            fd.plot();
        }
        if(this.value == '500')
        {
            fd.loadJSON(window.graphJsonFiveHundred);
            caliculatePositions();
            fd.plot();
        }
        if(this.value == '1000')
        {
            fd.loadJSON(window.graphJsonThousand);
            caliculatePositions();
            fd.plot();
        }
    })

    fd.loadJSON(window.graphJson);
     function caliculatePositions(){
        var startY = -200,
            initX = -600,
            initY = startY,
            diffX = 100,
            diffY = 150,
            maxY = 400;
         var prevNodeY = -1000,prevNodeX = -1000;
         var i =2;


        jQuery( fd.graph.nodes ).each( function( index, node )
        {
            var nodes = node;

            for(var key in nodes){




                if(initY < maxY && (nodes[key].pos.x ==0 && nodes[key].pos.y ==0))
                {
                    nodes[key].pos.x = initX  ;
                    nodes[key].pos.y = initY  ;
                    initY = initY + diffY ;
                }
                else if(initY >= maxY && (nodes[key].pos.x ==0 && nodes[key].pos.y ==0))
                {
                    i++;
                    initY = startY ;
                    initX = initX + diffX ;
                    nodes[key].pos.x = initX  ;
                    nodes[key].pos.y = initY  ;
                    initY = initY + diffY ;
                }

                var pX = nodes[key].pos.x;

                var lastY =nodes[key].pos.y-65;

                if(prevNodeY > lastY && prevNodeX < pX)
                {
                  //  console.log("py:"+prevNodeY+"lY:"+lastY);
                   // lastY  =   prevNodeY + 100;
                }

                nodes[key].eachAdjacency(function(adj){


                    var id = adj.nodeTo.id;
                    var subNode = fd.graph.getNode(id);

                    if(subNode.pos.x  == 0 && subNode.pos.y ==0)
                    {
                        subNode.pos.y =  prevNodeY =lastY ;
                        subNode.pos.x = prevNodeX= pX + 100;
                        lastY = lastY + 55;

                    }

                })

            }


        } );

     }

    caliculatePositions();

    // compute positions incrementally and animate.
    fd.computeIncremental({
        iter: 40,
        property: 'end',
        onStep: function(perc){
            Log.write('Network Topology Graph '+perc + '% loaded...');
        },
        onComplete: function(){
            Log.write('Network Topology Graph');
            fd.plot();
            console.log(new Date());

        }
    });
    // end





}