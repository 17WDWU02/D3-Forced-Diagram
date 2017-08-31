var width = 1000,
	height = 700,
	node,
	link;

var cirlceWitdh = 5;

var nodes = [
	{"id":1, "name":"Parent"},
	{"id":2, "name":"Child1", "targets":[1]},
	{"id":3, "name":"Child2", "targets":[1]},
	{"id":4, "name":"Child3", "targets":[1]},
	{"id":5, "name":"Child4", "targets":[2,3]}
]

var Links = [];
for (var i = 0; i < nodes.length; i++) {
	if(nodes[i].targets !== undefined){
		for(var j=0; j<nodes[i].targets.length; j++){
			Links.push({
				source: nodes[i].id,
				target: nodes[i].targets[j]
			})
		}
	}
};

var svg = d3.select("#canvas").append("svg")
	.attr("width", width)
	.attr("height", height)
	.style("background-color", "#bdc3c7")

var simulation = d3.forceSimulation()
	.force("charge", d3.forceManyBody().strength(-200))
	.force("link", d3.forceLink().id(function(data){
		return data.id
	}))
	.force("center", d3.forceCenter(width/2, height/2))

runSim();

function runSim(){
	link = svg.selectAll(".link")
		.data(Links, function(data){
			return data.target.id
		})

	link = link.enter()
		.append("line")
		.classed("link", true)

	node = svg.selectAll(".node")
		.data(nodes, function(data){
			return data.id
		})
	node = node.enter()
		.append("g")
		.classed("node", true)
		.call(d3.drag()
			.on("start", dragStart)
			.on("drag", drag)
			.on("end", dragEnd)
		)

	node.append("circle")
		.attr("r", cirlceWitdh)

	node.append("text")
		.attr("dy", 10)
		.text(function(data){
			return data.name
		})

	simulation
		.nodes(nodes)
		.on("tick", ticked)

	simulation.force("link")
		.links(Links)
}

function ticked(){
	link
		.attr("x1", function(data){return data.source.x; })
		.attr("y1", function(data){return data.source.y; })
		.attr("x2", function(data){return data.target.x; })
		.attr("y2", function(data){return data.target.y; });
	node
		.attr("transform", function(data){
			return "translate("+data.x+","+data.y+")"
		})	
}


function dragStart(data){
	if(!d3.event.active){
		simulation.alphaTarget(0.3).restart()
	}
}

function drag(data){
	data.fx = d3.event.x;
	data.fy = d3.event.y
}

function dragEnd(data){
	if(!d3.event.active){
		simulation.alphaTarget(0)
	}
	data.fx = undefined;
	data.fy = undefined;
}




















