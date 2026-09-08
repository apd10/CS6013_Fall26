# Rotation

Source: `Rotation.pdf` (6 pages, image-only). Informal lecture voice kept. Instructor comments from the `[?]` list are applied in the body.

**Convention.** \(N(\mu,\sigma)\) uses **standard deviation** \(\sigma\) (not variance).

---

## Page 1

**What if outliers are important?**

[Figure: stem plot. Horizontal axis: weight identifiers. Vertical axis: absolute magnitude. Several short sticks and one much taller stick in the middle — an outlier.]

E.g. Activation tensors are being quantised.

One approach: Separately store a sparse mask.

Alternatively "Rotate the Vector" to redistribute the energy

[Figure: two stem plots with an arrow between them. Same axes: weight identifiers vs absolute magnitude.]

- Left, labelled \(x\): one tall stick among short ones.
- Right, labelled \(Rx\): several sticks of more even height.

Quantisation: \(Q(\vec{x}) \rightarrow Q(R\vec{x})\)

- under \(Q(\vec{x})\): Quantisation of vector
- under \(Q(R\vec{x})\): Element wise quantisation.

\* we can use linear quantisation for \(Q\).

---

## Page 2

**How do we choose a rotation matrix.**

\* If \(\vec{x}\) was fixed / unknown?

- e.g: [fixed] weight matrix
- e.g: [unknown] Activation matrix

Say, \(\vec{x}\) was fixed.

A. Determine \(R\) which is optimal.

\(\Rightarrow\) But now you have to store \(R\) or \(R^{-1}\in\mathbb{R}^{d\times d}\)

\(R\): needs to be structured so that—

A given structured matrix may or may not work for a specific \(\vec{x}\).

In fact for any chosen \(R\), there is a \(\vec{x}\) for which \(R\vec{x}\) is catastrophic w.r.t quantisation!!

\(\rightarrow\) Example?

What should we do?

[Idea] Randomisation

---

## Page 3

**Random**

So that with high probability, \(Rx\) is not adversarial.

**Structured**

It can be stored efficiently.

**Example of commonly used transforms**

Randomised Hadamard

Let \(n=2^k\).

\[
H_2
=
\begin{pmatrix}
1 & 1 \\
1 & -1
\end{pmatrix}
\]

\[
H_n
=
H_{2^k}
=
\begin{pmatrix}
H_{2^{k-1}} & H_{2^{k-1}} \\
H_{2^{k-1}} & -H_{2^{k-1}}
\end{pmatrix}
\]

\[
R = \mathrm{Diag}(\vec{s})\cdot H_n
\]

\(\vec{s}\): Random sign vector

\(s_i \sim \{\pm 1\}\) with equal probability.

**why hadamard :**

Computational Comp

Multiplication complexity \(O(n^3)\rightarrow O(n^2\log n)\)
(an \(n\times n\) matrix multiplied by \(H_n\), \(n=2^k\))

'HadaCore': Kernel for Hadamard transform.
https://pytorch.org/blog/hadacore/

---

## Page 4

**Memory Cost**

1 bit per element.

\* Note: we can avoid this \(O(n)\) memory by using Universal Hash functions. (More on that later)

**Analysing effect of Rotations on outliers**

For simplicity Consider

\[
R
=
\begin{bmatrix}
\vdots \\
\cdots & N\!\left(0,\tfrac{1}{\sqrt{n}}\right) & \cdots \\
\vdots
\end{bmatrix}
\]

\[
R_{ij}\ \overset{\mathrm{iid}}{\sim}\ N\!\left(0,\tfrac{1}{\sqrt{n}}\right)
\]

---

## Page 5

Random Gaussian Matrix is almost orthogonal

\[
\|Rx\|_2 = (1\pm\epsilon)\,\|x\|_2
\]

with high probability

Given \(x\), what is the probability that some coordinate of \(Rx\) is greater than \(M\).

\[
P((Rx)_i > M) = ?
\]

\[
y = Rx
\]

\[
y_i = \sum_j r_{ij}\, x_j
\]

\[
E(y_i) = 0
\]

\[
\mathrm{Var}(y_i) = \sum_j x_j^2 \cdot \mathrm{Var}(r_{ij})
\]

---

## Page 6

\[
\mathrm{Var}(y_i) = \|x\|_2^2 \cdot \frac{1}{n}
\]

\[
\mathrm{Var}(y_i) \propto \frac{1}{n}
\]

\(y_i =\) Sum of Gaussian Variables

\[
y_i \overset{\mathrm{i.i.d.}}{\sim} N\!\left(0,\ \frac{\|x\|_2}{\sqrt{n}}\right)
\]

Let \(\sigma = \|x\|_2/\sqrt{n}\) and let \(\Phi\) be the CDF of the standard normal. Then

\[
\mathrm{Pr}(|y_i| > M)
=
2\bigl(1-\Phi(M/\sigma)\bigr).
\]

---

## Resolved comments (no open `[?]` left)

1. Stem plots: x = weight identifiers, y = absolute magnitude.
2. Grammar: "Activation tensors are being quantised."
3. Hadamard: uniform \(n=2^k\), \(H_n=H_{2^k}\) built from \(H_{2^{k-1}}\), \(R=\mathrm{Diag}(\vec{s})H_n\).
4. Complexity: \(n\times n\) times \(H_{n=2^k}\), so \(O(n^3)\to O(n^2\log n)\).
5. HadaCore: https://pytorch.org/blog/hadacore/
6. \(N(\mu,\sigma)\) is std throughout (matches \(\mathrm{Var}(y_i)=\|x\|_2^2/n\)).
7. Keep \(y_i=\sum_j r_{ij}x_j\) (handwriting on the PDF was wrong).
8. Tail uses the correct scale: \(2(1-\Phi(M/\sigma))\) with \(\Phi\) = standard normal CDF, \(\sigma=\|x\|_2/\sqrt{n}\).
