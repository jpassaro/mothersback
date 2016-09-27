# Mothersback

A JS library defining paths through planar graphs.

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
purpose of demonstrating how my path system works, and hopefully giving
users the chance to draw a pattern and look at the paths in it. I hope
that will be of interest even to the non-developer.

For other developers, I hope some more visually inclined than I might be
able to find nicer animations, cooler plane patterns with fun paths to
be found in them. There is definitely some potential for beauty here.

I've also long thought there's some cool math hiding in here: there are
a few questions and patterns raised by this system that could be the
focus of follow-up documents after the first one is complete.

For example: how do these paths behave in a tesselation of the plane?
Put another way: given a tesselation, are any paths truly bounded (i.e.
cross the same point in the same fashion twice)? Consider how equivalent
paths might be identified by the tesselation's own internal symmetry:
are there a finite number of equivalence classes? (I sure think so!) Are
any of these equivalence classes themselves finite?

### Why'd you choose such a weird name?

First: it is not easy to find a name that is unclaimed in the software
world and easy to remember!

Second: it is inspired by my path notion and its origin in sidewalk
cracks.  Childhood lore suggests fooling around with this stuff can be
dangerous for your mother's back. I make no guarantees: play at your
(her) own risk.

Third--

#### Let's be real: did you want the name to rhyme with Mothersbaugh?
[Maybe](https://en.wikipedia.org/wiki/Mark_Mothersbaugh).

## Tech stuff

We will define the basic functionality at an extremely high level. This
is essentially a graph theory problem: beyond the definition of a
loopless (for now) and undirected graph, only a small amount of
additional structure[*](#addl-structure) is needed to define the planar
arrangement we'll be playing with. In principle, the graph nodes may be
just about anything.

For the pretty visuals we have in mind, they'll probably be SVG objects.
As such, we should be able to build some utilities for using arbitrary
X/Y points, and in particular SVG points or something similar.

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
      function innerprint(c, prefix){
         if (c){
            console.log(`${prefix} I visit ${c.obj} of type ${c.type}`);
         }
      }
      innerprint(component, 'now');
      innerprint(previous, 'last time');
      innerprint(next, 'next time');
      console.log('/////////')
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
1. Get closer to a formal API for the abstract or high-level version
1. Write super simple tests: Triangle/square; two-polygon arrangements
1. Rough implementation
1. Expand to more complicated tests / arrangements
1. Create svg / visual / browser utilities
1. Test those, somehow, ideally automatically
1. Come up with a few illustrative examples for the intro document
1. Write the intro document

#### <a name="addl-structure">\*A quick note about the graph structure</a>
Above I mentioned the additional structure required on top of an
undirected loopless graph to make this work. For the library I'm using
this: given a node, there is some looped ordering of the edges on that
node, such that each edge has a unique "successor" edge with respect to
the node, and also is the successor to some unique "predecessor" edge on
that node. In terms of the real plane, you get this exactly by passing a
radius around the point and naming the edges you pass in clockwise
order.

What I really want is some representation that is preserved through
homotopy transformations of the plane: i.e. if you drag one of the
points a little bit or bend an edge just slightly, as long as no points
or edges cross each other as a result, the "planar arrangement" is
unaffected. Does that fit for my "order of edges" definition above? Who
knows! I'd love to find out in a future exploration: either prove the
equivalence or explore a counterexample.
