# Mothersback

A JS library defining paths through embedded graphs.

## What?

I suppose I could say more.

As a child and adolescent, I developed a sense of how a path could be
drawn through a grid arrangement. The most obvious example was the lines
and grids that form on a sidewalk, but many flooring patterns also have
a structure I could follow with the same logic.

I've found the pattern very difficult to explain, and I've long thought
it would be easier just to show it off. After some years in software
development and in particular some exposure to javascript and SVG with
interactions, it seems that might finally be achievable.

### Sounds fun, John, I'm happy for you. Should I care?

Thank you! And yes, as hedonistic as it is to express yourself with no
other goal in mind, hopefully there will be some reason for this to
exist.

The first-phase goal is an interactive walkthrough document, with the
purpose of demonstrating how the path system works, and hopefully giving
users the chance to draw a pattern and look at the paths in it. I hope
that will be of interest even to the non-developer.

For other developers, I hope some more visually inclined than I might be
able to make nicer animations, cooler patterns with fun paths to
be found in them. There is definitely some potential for beauty here.

I've also long thought there's some cool math hiding in here: there are
a few questions and patterns raised by this system that could be the
focus of follow-up documents after the first one is complete.

For example, considering a tesselation of the plane could be fascinating.
Given a tesselation, are any paths truly bounded (i.e.
cross the same point in the same fashion twice)? Consider how equivalent
paths might be identified by the tesselation's own internal symmetry:
are there a finite number of equivalence classes? (I sure think so!) Are
any or all of these equivalence classes themselves finite?

### Why'd you choose such a weird name?

First: it is not easy to find a name that is unclaimed in the software
world and easy to remember!

Second: it is inspired by my path notion and its origin in sidewalk
cracks.  Childhood lore suggests fooling around with this stuff can be
dangerous for your mother's back. I make no guarantees: play at your
(her) own risk.

Third--

#### Let's be real: did you want the name to rhyme with Mothersbaugh?
[That dude](https://en.wikipedia.org/wiki/Mark_Mothersbaugh) is really cool. I
shall offer no apology.

## Tech stuff

We will define the basic functionality at an extremely high level. This
is essentially a graph theory problem: beyond the definition of a
loopless (for now) and undirected graph, only a small amount of
[additional structure](#addl-structure) is needed to define the planar
arrangement we'll be playing with.

In principle, we're not picky about what the graph nodes are. In testing
and abstract buliding, they will be integers. For the pretty visuals we
have in mind, they'll probably be SVG objects. We should be able to
build some utilities for arbitrary X/Y points in the cartesian plane,
which we could then exploit with SVG points or something similar.

### API sketch

(N.B. this is extremely tentative)

We'll initialize some kind of "canvas" which will call for just enough
information about points and edges to define a set of faces. That being
done, the main thing we'll do is traverse this graph, given a starting
point and a direction. By traverse I mean something like this:

    var points = ...;
    var edges = ...;
    canvas = new Canvas(points, edges); // calculates faces

    function visit(component, previous, next){
      // application's custom visit function
      function innerprint(c, prefix){
         if (c){
            console.log(`${prefix} I visit ${c.obj} of type ${c.type}`);
         }
      }
      innerprint(component, 'now');
      innerprint(previous, 'last time');
      innerprint(next, 'next time');
      console.log('/////////')
      animate(component);
    }
    var start = points[0];
    var second = edges[0];
    canvas.traverse(first, second, visit);

Let's demonstrate with an extremely easy example: say that
`points === [0, 1, 2]` and that the `edges` describe a triangle in which
`edges[0]` links `0` to `1` (nondirectionally). In that case, we should
see the following:

    now I visit 0 of type POINT
    next time I visit EDGE[0, 1] of type EDGE
    /////////
    now I visit EDGE[0, 1] of type EDGE
    last time I visit 0 of type POINT
    next time I visit 1 of type POINT
    /////////
    now I visit 1 of type POINT
    last time I visit EDGE[0, 1] of type EDGE
    next time I visit EDGE[1, 2] of type EDGE
    /////////
    ...

Eventually it will traverse the whole triangle.

The visit function should be able to signal some intention for what
comes next; for example, stopping early, or restarting somewhere else.
The traversal API will also support a Promise framework for doing
something to conclude it -- for example inspect the path and store some
datum gathered from it, e.g. the length before it repeated itself.

### Technical To-Do list
1. Get closer to a formal API for the abstract version
1. Write super simple tests: Triangle/square; two-polygon arrangements
1. Rough implementation
1. Expand to more complicated tests / arrangements
1. Create svg / visual / browser utilities
1. Test those, somehow, ideally automatically
1. Come up with a few illustrative examples for the intro document
1. Write the intro document

#### <a name="addl-structure">Additional graph structure</a>

We impose additional structure or requirements alongside the usual
definition of an undirected loopless graph.

> A "canvas" consists of a set of nodes and, for each node,
> a finite sequence of neighboring nodes or edges on that
> node: each edge has a unique "successor" edge with respect
> to the node, and also is the successor to some unique "predecessor"
> edge on that node.

Following from successor to successor results in visiting every edge on the
given node.

The easiest way to visualize this is in the familiar 2D cartesian plane: given
a point, you get the ordering by passing a radius counter-clockwise around the
point, and naming the edges you pass in order. The structure doesn't care where
the radius starts, only that when it hits edge A, the next edge it will hit is
edge B and the previous one is edge Z. (Of course this can also be done with a
clockwise motion, as long as the same one is used for all vertices in a given
canvas.)

# Questions for later

The structure I'm thinking of includes distinct faces, meaning the graph must
be [embedded](https://en.wikipedia.org/wiki/Graph_embedding), whether on a
cartesian plane (equivalently a sphere) or something more complicated like a
torus ([example](http://mathworld.wolfram.com/UtilityGraph.html)). Regardless
of which figure the graph is embedded in, Mothersback needs to be able to
identify the "faces" on it: the order of vertices / edges, which faces are
adjacent via a given edge or vertex. Does the ordered-edge description meet
that requirement? What does standard graph theory have to tell me about faces?
Can I find a graph that lends itself to two incompatible versions of my canvas?

Assuming no, the other thing I want is that when embedded in a 2-dimensional
figure, the structure is preserved through (a reasonable subset of) homotopy
transformations: i.e. if you drag one of the points a little bit or bend an
edge just slightly, as long as no points or edges cross each other as a result,
the canvas structure is unaffected.  At this time I think this "order of edges"
system is a minimal and complete description of such an arrangement. Is it in
fact? I'm pretty convinced by now that by "canvas" I'm aiming for a description
of edges and faces on a graph embedded in a 2D surface; perhaps I can prove
that the edge-order structure is isomorphic, or create and explore a
counterexample.

Another question to consider: as I define the tetrahedron according to edge
order, a strict vertex order rule appears. If I draw it like this:

```
    1
   /|\
  / | \
 /  0  \
| /   \ |
2-------3
```

Listing neighbors counterclockwise, we get this:

```
0: 1, 2, 3
1: 0, 3, 2
2: 0, 1, 3
3: 0, 2, 1
```

What if I swap two of the neighbors for one of the vertices, or two of them?
(Since that amounts to reversing the neighbor list, doing three is equivalent
to doing one, and doing all four is equivalent to the original.) So far, I
think the single-switch version cannot be drawn on the plane but can be drawn
on a torus. I have not managed to draw the double-switch version on the torus,
but I suspect it can be drawn on a surface of genus 2.

(If I do the same for a triangle (count one vertex's neighbors in reverse), there
is no effect: each neighbor list has length two, and since they are equivalent
up to cycles, switching them has no effect.)

More broadly, what are the properties of a canvas that corresponds to an
embedding of a graph? Is it possible to construct a graph embedding given any
"canvas"?  If not, what constitutes an embeddable canvas? What characterizes
canvases that can be drawn on a plane, versus those that require a torus, or
that require a different surface altogether?

What role does orientability play in this? Does the vertex-orders scheme rule
out creating a canvas from graphs drawn on non-orientable surfaces such as the
M&ouml;bius strip? (The utility graph can be so drawn, see the Wolfram link.)

Potentially useful examples:
* [A torus made using D3](https://toucano.uk/#gallery-torus)
* [A visualization of graph embeddings](http://demonstrations.wolfram.com/EmbeddingsOfGraphsInATorusAndInAMoebiusStrip/)
