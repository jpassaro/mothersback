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
Suppose there is a graph embedded in the plane and some isometry group on the
plane under which the graph is fixed (i.e. a tesselation). There is a finite
number of distinct paths modulo isometry; how many? How many of the equivalence
classes of paths contain a finite number of members? If an equivalence class is
infinite, under what circumstances are its members finite in length (i.e. repeat
themselves not only under isometry but in the original unbounded plane)?

### Why'd you choose such a weird name?

First: it is not easy to find a name that is unclaimed in the software
world and easy to remember!

Second: it is inspired by my path notion and its origin in sidewalk
cracks.  Childhood lore suggests fooling around with this stuff can be
dangerous for your mother's back. I make no guarantees: play at your
(her) own risk.

Third--

#### Did you want the name to rhyme with Mothersbaugh?
[That dude](https://en.wikipedia.org/wiki/Mark_Mothersbaugh) is really cool.

## Tech stuff

We will define the basic functionality at an extremely high level. This
is essentially a graph theory problem: beyond the definition of a
loopless (for now) and undirected graph, only a small amount of
[additional structure](#addl-structure) is needed to define the planar
arrangement we'll be playing with.

In principle, we're not picky about what the graph vertices are. In testing
and abstract buliding, they will be integers. For the pretty visuals we
have in mind, they'll probably be SVG or Canvas objects.

### API sketch

(N.B. this is extremely tentative)

We'll initialize some kind of "canvas" which will call for just enough
information about points and edges to define a set of faces. That being
done, the main thing we'll do is traverse this graph, given a starting
point and a direction. By traverse I mean something like this:

    canvas = new MBCanvas({points: ..., edges: ...}); // calculates faces

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
    var start = canvas.points[0];
    var second = canvas.edges[0];
    canvas.traverse(first, second, visit);

Let's demonstrate with an extremely easy example: say that
`points.length === 3` and that the `edges` describe a triangle in which
`edges[0]` links `points[0]` to `points[1]` (nondirectionally). In that case,
we should see the following:

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
1. Write super simple tests: Triangle/square; two-polygon arrangements;
   tetrahedron.
1. write more complicated tests. draw from real life patterns i've encountered;
   also try K5 and K3,3 on mobius strip or on torus.
1. Rough implementation
1. Expand to more complicated tests / arrangements
1. Create svg / visual / browser utilities
1. Test those, somehow, ideally automatically
1. Come up with a few illustrative examples for the intro document
1. Write the intro document

#### <a name="addl-structure">Additional graph structure</a>

We start with the usual definition of a loopless undirected graph: namely a set
`V` of vertices, and a set `E` of edges, which are labeled cardinality-2 subsets
of `V` (i.e. unordered pairs of vertices). (The labeling is because in principle we
could have more than one edge connecting the same pair of vertices.)

To form our "canvas", we add for each vertex a cyclic ordering of the edges
adjacent to each vertex:

> A canvas consists of a set of vertices, a set of edges, and, for each vertex,
> a finite sequence of edges on that vertex: each edge has a unique "successor"
> edge with respect to the vertex, and also is the successor to some unique
> "predecessor" edge on that vertex. Which edge comes first for a given vertex
> has no impact on the canvas as long as the cyclic order (the
> successor/predecessor relation) remains constant.

Following from successor to successor results in visiting every edge on the
given vertex.

The easiest way to visualize this is in the familiar 2D cartesian plane: given
a point, you get the ordering by passing a radius counter-clockwise around the
point, and naming the edges you pass in order. The structure doesn't care where
the radius starts, only that when it hits edge A, the next edge it will hit is
edge B and the previous one is edge Z. (Of course this can also be done with a
clockwise motion, as long as the same one is used for all vertices in a given
canvas.)

After determining most of the above, I sought out [Bohan and
Thomassen](#citations), which confirmed that this system is a sufficient
combinatorial representation of the systems I want to model. They also provide
an interesting extension that we will probably incorporate, a "sign" function
on edges that allows for nonorientable embeddings:

> A canvas includes a boolean flag for each edge, indicating whether or not
> orientation "flips" when traversing that edge.

In that case the procedure for finding faces is slightly more complicated: when
an odd number of flipping edges have been traversed, from a vertex you
proceed to the predecessor rather than the successor. Hopefully this will be
easier to demonstrate when a visual example can be drawn.

For example, with a graph embedded on a M&ouml;bius strip, we would want to
arrange it such that a segment of the strip appears to be flat and contains all
of the vertices; we'd take clockwise or counterclockwise sequences of edges
from that, and label edges as "flipping" based on whether they pass over the
"non-flat" part of the strip an odd number of times. Equivalently, you make a
cut in the M&ouml;bius strip that does not intersect any vertex; form a regular
flat strip, take orderings in the regular planar fashion, and label as
"flipping" those edges that pass over the cut an odd number of times.

# Questions for later

There's a finite number of distinct (up to automorphism) embeddings of, say,
K4 (tetrahedron). I imagine this finite number is rather small. What is it?
What is each embedding's orientability and genus?

Potentially useful examples:
* [A torus made using D3](https://toucano.uk/#gallery-torus)
* [A visualization of graph embeddings](http://demonstrations.wolfram.com/EmbeddingsOfGraphsInATorusAndInAMoebiusStrip/)

<a name="citations">Citations</a>:
* [Graphs on Surfaces](https://www.fmf.uni-lj.si/~mohar/Book.html), Mohar and Thomassen.
