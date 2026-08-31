# Transcription: Rejection Sampling

Sources:

- `slides/rejection_sampling.pdf` (4 handwritten pages)
- `slides/rejection_sampling_2.pdf` (3 handwritten pages)

Wording is kept as on the page. Only unambiguous spelling is cleaned. Equations are LaTeX, not a rewrite of the math.

Figures are described in words so they can be redrawn on slides later.

---

## Page 1

So importance sampling lets us compute \(\mathbb{E}_f[w(x)]\) but what if we want to get samples from \(f(x)\) but cannot sample directly from it.

**Example:** Get a point \(x\) in 2D sampled uniformly at random from a circle of radius \(r\) using only \(U[0,1]\) variables.

**Figure:** a circle with radius labeled \(r\).

**Solution:**

**Figure:** a square with an inscribed circle and a sample marked \(\times\) inside the circle. Horizontal axis labeled \(2rx\), vertical axis labeled \(2ry\). Beside the figure: \(x,y \in U[0,1]\). Axis labels may be \(2r\,x\) and \(2r\,y\).

---

## Page 2

\* Sample uniformly in square

→ Reject if outside the circle

Now consider the generic case

- \(f(x)\): target distribution
- \(g(x)\): distribution to be used.

\[
a \sim g(x)
\]

How do we make sure that probability of getting \(x\) is actually \(f(x)\)?

if \(\underline{g(a) > f(a)}\)

→ Reduce the probability.

→ start **rejecting** the sample!

**Figure:** a number line with a point labeled \(a\). A vertical dashed segment from the axis up to \(f(a)\), then continuing up to \(g(a)\). Beside it: accept with \(\mathrm{prb.}\left(\dfrac{f(a)}{g(a)}\right)\).

---

## Page 3

**Algo till now**

Sample \(a \sim g(x)\)

if \(g(a) \ge f(a)\): 

- \(r = \mathrm{Uniform}[0,1]\)
- if \(r > f(a)/g(a)\)
  - Reject and go sample again
- otherwise
  - Accept, return \(a\)

**else** ??

What about if \(f(a) > g(a)\)

→ we need to increase the probability of \(a\)

But how?

⇒ Decrease probability of other "\(x\)" enough so that we can relatively use \(g(a)\)

---

## Page 4

**Envelope:** Choose an \(M\) s.t. \(Mg(x) > f(x)\ \forall x\)

**Algo:**

- Sample \(a \sim g(x)\)
- \(r = U[0,1]\)
- if \(r < \dfrac{f(a)}{Mg(a)}\): Accept `[?]` the page looks like it writes `a` instead of `r` on the left of `<`
- else: Reject and Sample again

**Figure:** black curve \(f\) with height labeled \(f(a)\) at a vertical line. A larger green envelope curve above it, with the top of the same vertical line labeled \(Mg(a)\).

---

## Part 2 — `rejection_sampling_2.pdf`

### Page 1

Example of where to use the Rejection Sampling (Cooked up)

Consider Attention Computation.

**Figure:** two wide bars labeled \(K\) and \(V\), each \(\mathbb{R}^{d\times n}\). A circle labeled \(q\) of shape \(\mathbb{R}^{d\times 1}\), with an arrow from \(q\) into \(K\).

\[
\mathrm{Att}(K,V,q)
=
\frac{\sum_{i=1}^{n} e^{\langle k_i,q\rangle}\, v_i}
{\sum_{i=1}^{n} e^{\langle k_i,q\rangle}}
\]

Let us say you wanted to approximate the denominator with a sample
\[
S=\sum_{i=1}^{n} e^{\langle k_i,q\rangle}
\]

---

### Page 2

What is the best sampling probability distribution?

→ Importance Sampling say
\[
p(i)\propto e^{\langle k_i,q\rangle}
\]

Say somehow we have obtained the sample proportional to
\[
\langle k_i,\bar q\rangle
\]
where \(\bar q\) is some "representative" query. Note \(q\) is not available beforehand in decode.

**Figure:** bars \(K\) and \(V\) with \(q\) on the right and an arrow into \(K\). Sequence positions \(1,2,\ldots,n\) under \(V\), with \(\bar q\) marked along that axis.

---

### Page 3

\[
[i_1,i_2,\ldots,i_n]
\]
\[
p(i_j)\propto \langle k_{i_j},\bar q\rangle
\]

Now can you get a sample from this subset that is s.t.
\[
p(i_{j_k})\propto \langle k_{i_{j_k}}, q\rangle
\]
where \(q\) is the actual query?

→ Can use Rejection Sampling!!

---

## Uncertain readings `[?]` (part 2)

1. **Page 3, subset length.** Written \([i_1,i_2,\ldots,i_n]\). It is called a subset, so the last index may be \(i_m\) rather than \(i_n\). Transcribed as written.

2. **Page 2 vs page 3, proposal.** Best IS distribution uses \(e^{\langle k_i,q\rangle}\); the proxy subset uses the inner product \(\langle k_{i_j},\bar q\rangle\) without the exponential. Transcribed as written.

3. **Page 1, "Cooked up".** Informal label on the example. Kept.

