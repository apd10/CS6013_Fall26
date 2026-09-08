# Transcription: Weighted Reservoir Sampling

Source: `slides/Weighted reservoir sampling.pdf` (6 handwritten pages).

Wording is kept as on the page. Only unambiguous spelling is cleaned. Equations are LaTeX.

---

## Page 1

**Problem setup:**

Stream
\[
\{(x_1,w_1),(x_2,w_2),\ldots\}
\]

At time \(t>k\), \(k\) sample size.

\[
\Pr(x_i\text{ in Sample})\propto w_i
\]
\([*]\) incorrect/incomplete

---

**WRS without "Replacement"** \([P\text{-}WRS\text{-}w/o]\)

Maintain a sample \(k\). s.t at each point in time \(t>k\), the probabilities of inclusion match the following procedure

"If you construct \(k\) sample iteratively the probability that \(i\) is sampled at step \(t\) is \(\propto w_i\)"

Note that under this the marginal probabilities of \(x_i\) in \(k\)-sample is **NOT** proportional to \(w_i\)

eg. \(\{w_1,w_2,w_3\}\), \(k=2\)

---

## Page 2

\[
\Pr(w_i\text{ in sample})
=
\frac{w_i}{w_1+w_2+w_3}
\left[
1
+
\frac{w_j}{w_i+w_k}
+
\frac{w_k}{w_i+w_j}
\right]
\]

Thus \(\Pr(w_i\text{ in sample})\not\propto w_i\)

---

How do we design a random key algorithm?

\[
r_i=U[0,1]
\]
\[
X_i=\mathcal{F}(r_i)
\]

Sort \(X_i\) and pick top-\(k\).

so that
\[
\Pr(X_i\text{ in Sample})=\text{P-WRS-w/o}(i)
\]

How should we pick \(\mathcal{F}\)??

---

## Page 3

**[Intuition] How to pick \(\mathcal{F}\)**

Simplicity: let us only look at \(k=1\)

I want probability that \(i\) lies at right most to be \(\propto w_i\)

What should density of \(X\) look like??

**Figure.** Horizontal axis from \(0\) to \(1\). Three increasing curves, meeting a vertical line at \(x=1\), labeled \(x_1,x_2,x_3\) from top to bottom. A small interval just left of \(1\) is marked \(\Delta\).

If \(w_1>w_2>w_3\) then \(\leftarrow\) [higher curve for larger weight]

\[
\Pr(x_i\text{ lies in }\Delta)\propto w_i
\]
\[
f(X_i)=f_i(x)\propto w_i
\quad\text{at }1
\]
\[
f_i(x)=w\cdot g(x)
\quad\text{where }g(1)=1
\]

---

## Page 4

\[
f_i(x)=w\cdot g(x)
\]
\[
\int f_i(x)=1
\implies
\int_{0}^{1} g(x)=\frac{1}{w}
\]

do we know such \(g(x)\)?
\[
g(x)=[\;\cdots\;]
\]

---

\[
g(x)=x^{w-1}
\qquad (g(1)=1)
\]
\[
f_i(x)=w_i\cdot x^{w_i-1}
\]

Then density should be such that
\[
f_i(x)=w_i\cdot x^{w_i-1}
\]
\[
F_i(x)=x^{w_i}
=\int_{0}^{x} w_i\cdot u^{w_i-1}\,du
\]

---

\[
X_i=r_i^{1/w_i}
\qquad r_i\sim U[0,1]
\]

\[
F_i(x)=\Pr(X_i\le x)
=\Pr(r_i^{1/w_i}\le x)
=\Pr(r_i\le x^{w_i})
=x^{w_i}
\]

---

## Page 5

Thus "Potentially" \(\mathcal{F}(r_i)=r_i^{1/w_i}\) can work.

→ We have not proved anything yet. We have just come up with "a potential" proposal that "might" work.

**Proof:**

Full proof is out of scope. But we can prove a lemma.

**lemma:**

If \(r_1\) and \(r_2\) are \(U[0,1]\),
\[
x_1=r_1^{1/w_1},\qquad x_2=r_2^{1/w_2}
\]
\[
w_i>0
\]
\[
\Pr(x_1\le x_2)=\frac{w_2}{w_1+w_2}
\]

---

## Page 6

**Proof:**
\[
\Pr(X_1\le X_2)
=
\Pr\!\left(r_1^{1/w_1}<r_2^{1/w_2}\right)
=
\Pr\!\left(r_1<r_2^{w_1/w_2}\right)
\]
\[
=
\int_{r_2=0}^{1}
\int_{r_1=0}^{r_2^{w_1/w_2}}
\,dr_1\,dr_2
\]
\[
=
\int_{0}^{1}
r_2^{w_1/w_2}\,dr_2
\]
\[
=
\left.
\frac{r_2^{w_1/w_2+1}}{\frac{w_1}{w_2}+1}
\right|_{0}^{1}
=
\frac{w_2}{w_1+w_2}
\qquad\square
\]

Can you extend "non-random-key" algo to WRS. **[Exercise]**

---

## Instructor notes

1. **Page 1.** \(t>k\) — confirmed.
2. **Page 1.** `[P-WRS-w/o]` — confirmed.
3. **Key map** is \(\mathcal{F}\), not \(F\). Density stays \(f_i\); CDF stays \(F_i\).
4. **Page 1.** Quote kept as written: "construct \(k\) sample iteratively".
5. **Page 2.** LHS kept as \(\Pr(w_i\text{ in sample})\). \(w_j,w_k\) are the other two weights.
6. **Page 3–4.** \(f_i(x)=w\cdot g(x)\) then \(w_i\) in the pdf, as on the pages.
