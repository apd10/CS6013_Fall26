# Transcription: Reservoir Sampling

Source: `slides/Reservoir sampling.pdf` (15 handwritten pages; page 15 is blank).

Wording is kept as on the page. Only unambiguous spelling is cleaned (`Sampling`, `assigned`). Equations are LaTeX. Instructor corrections applied.

---

## Page 1

Previous Cooked up example:

Assumed that we had a sample of KV
\[
p(i)\propto \phi(\langle k_i,\bar q\rangle)
\]

But in a auto-regressive generation total KV tokens keep on increasing

**Q.** How do we "maintain" a sample in that case?

**A.** Reservoir Sampling.

---

## Page 2

Consider a stream of data
\[
\{x_1,x_2,\ldots,x_t,\ldots\}
\]
at each point \(t\), we want to keep a sample of size \(k\)
\[
\{x_{i_1},x_{i_2},\ldots,x_{i_k}\}
\]
such that
\[
P(x_i\text{ is in sample})=\frac{k}{t}
\qquad\forall t
\]

"Stream": we process the data point only once and "throw" it away.

At time \(t\) we look at \(x_t\)

"Build a streaming algorithm for sampling"

---

## Page 3

**A.**

let us say we have a sample
\[
\{x_{i_1},\ldots,x_{i_k}\}
\quad\text{at time }t
\]
\[
P(i)=\frac{k}{t}.
\]
At time \((t+1)\), we got \(x_{t+1}\)

**Q.** Choose \(x_{t+1}\) with Prob?
\[
\left(\frac{k}{t+1}\right)
\quad
\left\{\begin{array}{l}
\text{check }r\sim U[0,1]\\
r\le \dfrac{k}{t+1}
\end{array}\right.
\]

**Q.** If chosen, throw one of the other sampled data with uniform probability
\[
P(x_{t+1}\text{ is in sample at }(t+1))=\frac{k}{t+1}
\]

---

## Page 4

\[
P(x_i\text{ is in sample at }(t+1))
=
P(x_i\text{ is in sample at }t)
\times
P(x_i\text{ is not thrown})
\]
\[
=\frac{k}{t}\big[\;\cdots\;\big]
\]
\[
=\frac{k}{t}\left[
\frac{1+t-k}{1+t}\cdot 1
+\cdots
\right]
\]
\[
=\frac{k}{t}\left[
\frac{1+t-k}{1+t}
+
\frac{k}{1+t}\cdot\frac{k-1}{k}
\right]
\]
\[
=\frac{k}{t}\left[
\frac{1+t-k+k-1}{1+t}
\right]
\]

---

## Page 5

\[
=\frac{k}{t}\cdot\frac{t}{1+t}
=\frac{k}{1+t}
\]

Thus the algorithm works.

---

**Another simple algorithm:** Random Key algorithm.

→ Every \(x_i\) is assigned a random value \(r_i\sim U[0,1]\)

→ At each point \(t\), the sample is the \(x_i\)s with

Cont…

---

## Page 6

Highest \(k\) values.

→ random key assignment gives a permutation.

→ probability that any key is chosen is \(k/t\) at all times \(t\).

→ At each time you only have to keep track of top \(k\) \(x_i\)s and their scores

---

## Page 7

**At \(t+1\):**
\[
S=\{x_{i_1},\ldots,x_{i_k}\}
\]
\[
R=\{r_{i_1},\ldots,r_{i_k}\}
\]
\[
r_{t+1}=U[0,1]
\]

If \(r_{t+1}<\min R\):

discard \(x_{t+1}\)

Else

Add \((x_{t+1},r_{t+1})\) and discard the min

---

## Page 8

In our previous example we wanted to sample proportionate to some weights.

**Weighted Reservoir Sampling**

Given a stream,
\[
\{(x_1,w_1),(x_2,w_2),\ldots\}
\]
Maintain a sample of \(k\) values s.t.
\[
P(x_i\text{ in sample})\propto w_i
\]

---

## Page 9

**Algo**

Assign every value \(x_i\) a random value computed as
\[
r_i\sim U[0,1]
\]
\[
\mathrm{key}_i=r_i^{1/w_i}
\]
Keep top-\(k\) keys.

---

## Page 10

**lemma:**

If \(r_1\) and \(r_2\) are \(U[0,1]\),
\[
X_1=r_1^{1/w_1},\qquad X_2=r_2^{1/w_2}
\]
\[
w_i>0
\]
\[
P(X_1\le X_2)=\frac{w_2}{w_1+w_2}
\]

**Proof:**
\[
P_r(X_1\le X_2)
=
P_r\!\left(r_1^{1/w_1}<r_2^{1/w_2}\right)
=
P_r\!\left(r_1<r_2^{w_1/w_2}\right)
\]

---

## Page 11

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
\]

\(\square\)

---

## Page 12

How to extend the previous algorithm to WRS?

→ **A.** Chao algorithm.

---

## Page 13

**Weighted Reservoir Sampling**

Stream
\[
\{(x_1,w_1),(x_2,w_2),\ldots,(x_t,w_t),\ldots\}
\]

Maintain a sample of size \(k\) such that
\[
P(x_i\text{ in sample at }t)\propto w_i
\]

Can we apply Same Algo?

\(x_{t+1}\) is selected with probability?

Say
\[
P_{t+1}=\frac{w_{t+1}\cdot k}{\sum_{i=1}^{t+1} w_i}
\]

---

## Page 14

What is the issue?

\(P_{t+1}\) can be \(>1\)

**Q:** How do we get around this.? **[Think]**

---

## Page 15

(blank)

---
