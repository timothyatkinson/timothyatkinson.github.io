function extended_split(str, separator, max) {
    var out = [],
        index = 0,
        next;

    while (!max || out.length < max - 1 ) {
        next = str.indexOf(separator, index);
        if (next === -1) {
            break;
        }
        out.push(str.substring(index, next));
        index = next + separator.length;
    }
    out.push(str.substring(index));
    return out;
};

function convert_graph(data, type, name){
	var nodes = data.split("|")[0];
	var edges = data.split("|")[1];
	nodes = nodes.split("[")[1];
	edges = edges.split("]")[0];
	nodes = nodes.trim();
	edges = edges.trim();

	var gid = name;
	if(type == "subgraph"){
		gid = "cluster_"+gid;
	}

	var digraph = type + " " + gid + " { forcelabels=true;";
	if(type == "subgraph"){
		digraph = digraph + " label = <" + name + ">;";
	}
	digraph = digraph + "\n";
	var nodeList = nodes.split(")");
	var i;
	for(i = 0; i < nodeList.length; i++){
		var node = nodeList[i];
		node = node.trim();
		if(!node.includes(",")){
			i = nodeList.length;
			break;
		}
		node = node.split("(")[1];
		var id = node.split(",")[0];
		var label = node.split(",")[1];
		label = label.trim();
		id = id.trim();
		var labelmark = label.split("#");
		var mark = "Uncoloured"
		if(labelmark.length > 1){
			label = labelmark[0].trim();
			mark = labelmark[1].trim();
		}
		if(label == "empty"){
			label = "";
		}
		var idmod = id;
		if(type == "subgraph"){
			idmod = id + name;
		}
		digraph = digraph + "\n     " + idmod + " [label= <" + label + "<BR /><BR /><FONT POINT-SIZE=\"9\">" + id + "</FONT>>, shape=ellipse";
		if(mark != "Uncoloured"){
			digraph = digraph + ", style=filled, fillcolor=" + mark;
		}
		digraph = digraph + "]";
	}
	var edgeList = edges.split(")");
	for(i = 0; i < edgeList.length; i++){
		var edge = edgeList[i];
		edge = edge.trim();
		if(!edge.includes(",")){
			i = edgeList.length;
			break;
		}
		edge = edge.split("(")[1];
		var id = edge.split(",")[0];
		var source = edge.split(",")[1];
		var target = edge.split(",")[2];
		if(type == "subgraph"){
			source = source + name;
			target = target + name;
		}
		var label = edge.split(",")[3];
		label = label.trim();
		source = source.trim();
		target = target.trim();
		var labelmark = label.split("#");
		var mark = "Uncoloured"
		if(labelmark.length > 1){
			label = labelmark[0].trim();
			mark = labelmark[1].trim();
		}
		if(label == "empty"){
			label = "";
			digraph = digraph + "\n     " + source + "->" + target + " [constraint=false,label = <>"
		}
		else{
			digraph = digraph + "\n     " + source + "->" + target + " [label= <<table border=\"0\" cellborder=\"0\" cellspacing=\"0\"><tr><td bgcolor=\"white\">" + label + "</td></tr></table>> ";
		}
		if(mark != "Uncoloured"){
			digraph = digraph + ", color=" + mark;
		}
		digraph = digraph + "]";
	}
	digraph = digraph + "\n}\n";
	console.log(digraph);
	return digraph;
}

function convert_rule(ruledata){

	var decl = extended_split(ruledata, ")", 2)[0] + ")";
	var rule = extended_split(ruledata, ")", 2)[1];
	var L = convert_graph(rule.split("=>")[0], "subgraph", "L");
	var R = convert_graph(rule.split("=>")[1], "subgraph", "R");
	var digraph = "digraph Rule { forcelabels=true; rankdir=TB; compound=true;\n";
	var decllist = extended_split(decl, "(", 2);
	var vars = "(" + decllist[1];
	digraph = digraph + "label = <" + decl + ">;\n"
	digraph = digraph + L;
	digraph = digraph + "\n" + R;

	digraph = digraph + "\n}\n";
	console.log(digraph);
	return digraph;
}
