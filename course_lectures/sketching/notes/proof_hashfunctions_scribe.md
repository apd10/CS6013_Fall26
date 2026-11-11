# \(\ell_2\) subspace embeddings via a JLT, and limited independence

Source: [`proof_hashfunctions.pdf`](../proof_hashfunctions.pdf). Handwritten notes following Woodruff's argument that a Johnson–Lindenstrauss transform is an \(\ell_2\)-subspace embedding, then \(k\)-wise independence and two ways to stretch a few random bits into many pairwise independent bits.

The writeup below follows the pages in order. A few lines are ambiguous or inconsistent with the boxed claim; those are marked **as written** and corrected in the notes page.

---

## Page 1 — size of a \(\gamma\)-net

**Title.** Proof of construction of an \(\ell_2\) subspace embedding via JLT matrices.

**Claim.** The size of a \(\gamma\)-net of the sphere \(S^{d-1}\) is
\[
|N| \le \left(1 + \frac{2}{\gamma}\right)^d.
\]

**Proof, as written.**

Construct a \(\gamma\)-net by placing points on \(S^{d-1}\) maximally so that no two are within distance \(\gamma\). This is a \(\gamma\)-net.

Consider balls of radius \(\gamma/2\) around these points. The line reads “the balls are not disjoint,” and the next formula is the sum of their volumes,
\[
|N| \cdot V_d \cdot \left(\frac{\gamma}{2}\right)^d.
\]
(\(V_d\) is the volume of the unit ball in \(\mathbb{R}^d\). Adding the volumes is the disjoint case: a maximal \(\gamma\)-separated set has disjoint balls of radius \(\gamma/2\).)

Consider a ball centered at the center of \(S^{d-1}\) of radius \((1+\gamma)/2\). This ball encapsulates all of the small balls. Thus
\[
|N| \cdot V_d \cdot \left(\frac{\gamma}{2}\right)^d
\le
\left(\frac{1+\gamma}{2}\right)^d \cdot V_d,
\]
and the page boxes
\[
|N| \le \left(1 + \frac{2}{\gamma}\right)^d.
\]

**Note.** The displayed inequality simplifies to \(|N| \le (1 + 1/\gamma)^d\), not \((1+2/\gamma)^d\). The boxed bound is the standard one, and it is what you get if the containing ball has radius \(1 + \gamma/2\) rather than \((1+\gamma)/2\):
\[
|N|
\le
\left(\frac{1+\gamma/2}{\gamma/2}\right)^d
=
\left(1+\frac{2}{\gamma}\right)^d.
\]

---

## Page 2 — a net for the column space, and the JLT hypothesis

**2.** Consider a matrix \(A \in \mathbb{R}^{n \times d}\) (“set” is crossed out). Let
\[
\mathcal{S}^{(A)}
=
\{\, y : \|y\|_2 = 1,\ y \in \mathcal{C}(A) \,\}
\]
be the unit sphere in the column space of \(A\).

**Q.** What is a \(\gamma\)-net of \(\mathcal{S}\), and what is its size?

Write \(y = Ux\) with \(x \in S^{d-1}\) (the “\(d-1\)” is written above \(S\)). There is a net point \(x' \in N(S^{d-1})\) with
\[
\|x' - x\|_2 < \gamma
\qquad\Rightarrow\qquad
\|Ux' - Ux\|_2 < \gamma.
\]
Therefore
\[
\{\, Ux : x \in N(S^{d-1}) \,\}
\]
is a \(\gamma\)-net of \(\mathcal{S}^{(A)}\).

**3.** Let \(S\) be a matrix — the page writes the shape as \(k \times d\) — such that \(S\) is a \(\mathrm{JLT}(\varepsilon, \delta, 5^d)\). Then
\[
\langle Sw,\ Sw' \rangle
=
\langle w,\ w' \rangle \pm \varepsilon
\]
for all \(w, w'\) in the \(\tfrac12\)-net of \(\mathcal{S}\).

**Note.** \(S\) multiplies vectors in the ambient space \(\mathbb{R}^n\), so the shape used in the rest of the course is \(r \times n\). The identity \(\|Ux'-Ux\|=\|x'-x\|\) needs \(U\) to have orthonormal columns.

---

## Page 3 — reduce to unit vectors, then expand along the net

The goal is
\[
\|SAx\|_2^2 = (1 \pm \varepsilon)\, \|Ax\|_2^2.
\]
If this holds for every \(x\) with \(\|Ax\|_2 = 1\), then it holds for every \(x\), by scaling.

Draw the set \(\mathcal{C}(A) \cap \{\, Ax : \|Ax\|_2 = 1 \,\}\) and take a \(\gamma\)-net of it with \(\gamma = 1/2\).

**To prove:** \(\|Sy\|_2^2 = 1 \pm \varepsilon\) for \(y = Ax\) with \(\|y\|_2 = 1\).

**How to proceed.** Write \(y\) in terms of net points \(w_0\) from the \(\tfrac12\)-net:
\[
y = w_0 + \Delta_0,
\qquad
w_0 \in \tfrac12\text{-net},
\qquad
\|\Delta_0\|_2 \le \tfrac12,
\]
and continue
\[
\Delta_0 = w_1 + \Delta_1,
\qquad
\Delta_1 = w_2 + \Delta_2,
\qquad
\ldots
\]
with each \(w_i\) in the \(\tfrac12\)-net.

---

## Page 4 — the series and the inner-product expansion

(The page is upside down in the scan.) Put the norms into the coefficients:
\[
y
=
w_0 + \|\Delta_0\|\, w_1 + \|\Delta_0\|\,\|\Delta_1\|\, w_2 + \cdots
=
w_0 + \lambda_1 w_1 + \lambda_2 w_2 + \cdots,
\]
where \(\lambda_i \le 1/2^i\) and \(w_i\) is in the \(\tfrac12\)-net. Then
\begin{align*}
\|Sy\|_2^2
&=
\langle Sy,\ Sy \rangle \\
&=
\left\langle
  S\Bigl(\sum_i \lambda_i w_i\Bigr),\;
  S\Bigl(\sum_j \lambda_j w_j\Bigr)
\right\rangle \\
&=
\sum_{i,j} \lambda_i \lambda_j \, \langle S w_i,\ S w_j \rangle \\
&=
\sum_{i,j} \lambda_i \lambda_j
  \bigl( \langle w_i,\ w_j \rangle \pm \varepsilon \bigr) \\
&=
\sum_{i,j} \lambda_i \lambda_j \, \langle w_i,\ w_j \rangle
  \;\pm\;
  \varepsilon \sum_{i,j} \lambda_i \lambda_j.
\end{align*}
The first sum is \(\langle y, y \rangle\), so
\[
\|Sy\|_2^2
=
\|y\|_2^2
\pm
\varepsilon \Bigl(\sum_i \lambda_i\Bigr)^2
=
1
\pm
\varepsilon \Bigl(\sum_i \lambda_i\Bigr)^2.
\]
The right-hand side of the last line is cut off on the page; the \(\varepsilon/4\) on the next page is the factor coming from \(\sum_i 2^{-i} = 2\).

---

## Page 5 — close the proof, then CountSketch bits

**Theorem.** Choose a \(\mathrm{JLT}(\varepsilon/4,\ \delta,\ 5^d)\). This completes the proof.

**Hash functions.**

\(S\) is a \(k \times d\) CountSketch matrix with
\[
k = O\Bigl(\frac{d^2}{\varepsilon^2 \delta}\Bigr),
\]
only one nonzero per column, and it is also an \(\ell_2\)-subspace embedding.

**Q.** How many random bits are needed to get a CountSketch matrix?

Completely random bits (mutually independent): if \(S\) is an \(m \times n\) matrix, the page boxes
\[
n \cdot \log_2(m)
\]
random bits.

---

## Page 6 — \(k\)-wise independence, and XOR of subsets

**Limited independence.** Random variables \(X_1,\ldots,X_n\) are \(k\)-wise independent if for any distinct indices and any values \(y_1,\ldots,y_k\),
\[
\Pr(X_{i_1}=y_1 \cap \cdots \cap X_{i_k}=y_k)
=
\Pr(X_{i_1}=y_1)\cdots\Pr(X_{i_k}=y_k).
\]

**Q.** How many bits are necessary to create pairwise (2-wise) independent bits?

From \(m\) random bits \(\{X_1,\ldots,X_m\}\) in \(\{0,1\}\), how many pairwise bits do we get?

Let \(S\) range over nonempty subsets (the page writes \(S \subseteq 2^m\), \(S \ne \emptyset\)). There are \(2^m - 1\) such subsets. For each one set
\[
Y_S = \bigoplus_{j \in S} X_j.
\]
The page boxes this family: \(2^m - 1\) pairwise independent bits from \(m\) independent bits.

---

## Page 7 — why the XOR family is pairwise independent

\[
\Pr(Y_i = y \cap Y_j = y') = \frac{1}{4}.
\]
Compare the two subsets. Their symmetric difference is nonempty, so there is an index in \(S_i \setminus S_j\) or in \(S_j \setminus S_i\). Without loss of generality \(X_k \in S_i \setminus S_j\).

Keep every other bit fixed. Flipping \(X_k\) from \(0\) to \(1\) flips \(Y_i\) and does not change \(Y_j\). Thus
\[
\Pr(Y_i = y \mid Y_j = y') = \tfrac12.
\]

---

## Page 8 — pairwise independent values in a prime field

Create pairwise random numbers using two random numbers. Let \(p\) be prime and
\[
X_1, X_2 \sim \mathrm{Unif}\{0,\ldots,p-1\},
\qquad
Y_i = (X_1 + \varphi_i \, X_2) \bmod p.
\]
This gives \(p-1\) numbers that are pairwise independent:
\[
\Pr(Y_i = y_i \cap Y_j = y_j)
=
\Pr(Y_i = y_i)\,\Pr(Y_j = y_j),
\]
and the page asks why the marginal is
\[
\Pr(Y_i = y_i) = \frac{1}{p}.
\]

**Hash functions.** The same formula, written for two indices:
\[
y_1 = (X_1 + i X_2) \bmod p,
\qquad
y_2 = (X_1 + j X_2) \bmod p.
\]
The page stops here. The “why” is the linear system in \((X_1, X_2)\): for \(i \ne j\) it has exactly one solution in \(\mathbb{F}_p^2\), so each pair of outputs has probability \(1/p^2\).
