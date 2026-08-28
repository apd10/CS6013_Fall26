# Transcription: Importance Sampling

**Importance Sampling:** \(\mathbb{E}_f[w(x)]\)

**\* Examples:**

1.
\[
\mathbb{E}_f[w(x)] = \frac{1}{n} \sum_{i=1}^{n} w(x_i), \qquad x_i \sim f(x)
\]
but we cannot sample from \(f(x)\).

2. Sometimes we may want to purposefully choose a different distribution, even if we can sample from \(f(x)\).

Consider an example:
\[
S = (x_1 + x_2 + \cdots + x_n), \qquad x_i \in \mathbb{R}
\]
attention output = \( a_1 v_1 + a_2 v_2 + \cdots + a_n v_n,\quad v_i \in \mathbb{R}^d\)

goal is to sample and estimate \(S\)
\[
S = n\,\mathbb{E}_p[x_i]
\]
where
\[
p(i) = \mathrm{Uniform}\{1,\ldots,n\}
\]
\[
\hat{S} = n \cdot \frac{1}{k} \sum_{j=1}^{k} x_{i_j}
\]

**Q** What are the cases in which this is not desirable sampling

**Example:** values of \(x_i\)
\[
\{10^6,\ 1,\ 1,\ 1,\ \ldots,\ 1\}, \qquad n = 100
\]

---

## Page 2

\[
\mathbb{E}(\hat{S}) = S \qquad \text{it is still unbiased,}
\]
but **variance.** will be high?

**Q.** What should be a good distribution?

→ A distribution that samples x_1 with high probability (very close to 1)

\* This condition is actually the case in attention computation.
\[
o = \sum a_i \vec{v}_i, \qquad \|v_i\| = \mathrm{Constant},
\]
\[
a_i = \frac{e^{\langle q, k_i \rangle}}{\sum_j e^{\langle q, k_j \rangle}}
\]
depending on dot products subsequent keys far from query \(q\) get exponentially small!

→ Random Sampling will not work!

Formalise this idea in importance Sampling.

- \(X\): Random variable
- \(w(x)\): function of interest
- \(\mathbb{E}[w(x)]\): Quantity of interest

---

## Page 3

- \(f(x)\): "true distribution"
- \(g(x)\): proposed distribution.

\[
\mathbb{E}_f[w(x)] = \mathbb{E}_g\big[\; ??\;\big]
\]


\[
\int w(x)\, f(x)\, dx = \int \frac{w(x)\, f(x)}{g(x)} \cdot g(x)\, dx \\
= \mathbb{E}_g\left[\frac{w(x)\, f(x)}{g(x)}\right]
\]

Estimator (left-hand side labeled \(\hat{\mu}\)):
\[
\mathbb{E}_f[w(x)] \;=\; \frac{1}{n} \sum_i \frac{w(x_i)\, f(x_i)}{g(x_i)}, \qquad x_i \sim g(x)
\]

\[
\mathbb{E}_g[\hat{\mu}] = \frac{1}{n} \sum_{i=1}^{n} \mathbb{E}_g\left[\frac{w(x_i)\, f(x_i)}{g(x_i)}\right]
= \frac{1}{n} \cdot n \cdot \mathbb{E}_f[w(x)]
= \mathbb{E}_f[w(x)]
\]

\* Unbiased? Yes.

---

## Page 4

So this works for any proposal \(g(x)\)

What's a good \(g(x)\)?

→ One with least variance!!

\[
\hat{\mu} = \frac{1}{n} \sum_{i=1}^{n} \frac{w(x_i)\, f(x_i)}{g(x_i)}
\]

\[
\mathrm{Var}(\hat{\mu}) = \frac{1}{n^2} \cdot n \cdot \mathrm{Var}_g\left(\frac{w(x_i)\, f(x_i)}{g(x_i)}\right)
= \frac{1}{n}\left[\mathbb{E}_g\left(\frac{w^2(x)\, f^2(x)}{g^2(x)}\right) - \mu^2\right]
\]

**Problem:**
\[
\underset{\substack{g \\ \int g(x)\,dx = 1 \\ g(x) > 0}}{\arg\min}\;
\mathbb{E}_g\left[\frac{w^2(x)\cdot f^2(x)}{g^2(x)}\right]
\]

\[
\int \frac{w^2(x)\, f^2(x)}{g^2(x)} \cdot g(x)\, dx
= \int \frac{w^2(x)\, f^2(x)}{g(x)}\, dx
\]

Choose a \(g(x)\) which minimises this.

---

## Page 5

**How do we proceed?**

Simplicity Consider discrete case

\[
\min_{g(x)}\ \sum_i \frac{w^2(x_i)\, f^2(x_i)}{g(x_i)}
\qquad
\sum_i g(x_i) = 1,\quad g(x) > 0
\]

rewrite:
\[
\sum_i \frac{w^2(x_i)\, f^2(x_i)}{(\sqrt{g(x_i)})^2}
\qquad
\sum_i \big(\sqrt{g(x_i)}\big)^2 = 1
\]

If every "\(i\)" is a dimension
\[
\min.\quad
\left\| \frac{w(x_i)\, f(x_i)}{\sqrt{g(x_i)}} \right\|_2^2
\;*\;
\left\| \sqrt{g} \right\|_2^2
\qquad\text{with }\ \|\sqrt{g}\|_2^2 = 1
\]

\[
\|a\|_2^2\, \|b\|_2^2 \;\ge\; ?
\]

**Cauchy Schwartz**
\[
\|a\|_2\, \|b\|_2 \;\ge\; \langle a, b \rangle
\]

---

## Page 6

There is a integral version of this
\[
\int \left(\frac{|w(x)|\, f(x)}{\sqrt{g(x)}}\right)^2 dx
\cdot
\int \big(\sqrt{g(x)}\big)^2 dx
\;\ge\;
\left( \int |w(x)| \cdot f(x)\, dx \right)^2
\]

\[
= \mathbb{E}_f\big[|w(x)|\big]
\]
(labeled **minimum value**)

is Cauchy Schwartz tight?

Yes!

When is minimum achieved?
\[
\sqrt{g(x)}\ \propto\ \frac{|w(x)|\, f(x)}{\sqrt{g(x)}}
\]

**boxed:**
\[
g(x)\ \propto\ |w(x)|\, f(x)
\]

---

## Page 7

\[
g(x) = \frac{|w(x)|\, f(x)}{\int |w(x)|\, f(x)\, dx}
\]

**boxed:**
\[
g(x) = \frac{|w(x)|\, f(x)}{\mathbb{E}_f\big[|w(x)|\big]}
\]

This is the best proposal distribution.

**Does it make sense?**

\(|w(x)\cdot f(x)|\) is exactly the "contribution" of \(i\)th term to the expectation.

\(w(x) > 0\ \forall x\), then what is the variance?
\[
g(x) = \frac{w(x)\, f(x)}{\mathbb{E}_f(w(x))}
\]
\[
\mathrm{Var}(\hat{\mu}) = \frac{1}{n}\left[
\int \frac{w^2 f^2}{g^2}\, g\, dx
\;-\;
\mathbb{E}_f(w(x))^2
\right]
\]
(the integral is underbraced)

---

## Page 8

\[
= \frac{1}{n}\Big[ \mathbb{E}_f(w(x))^2 - \mathbb{E}_f(w(x))^2 \Big]
= 0\ !!
\]

Something Wrong?

No. \(g(x)\) needs you to know \(\mathbb{E}_f(w(x))\)!

In practice, we will be trying to cheaply get a proposal \(g(x)\) that is close to \(f(x)|w(x)|\).

**Attention example**
\[
o = \sum_{i=1}^{n} a_i v_i
\]

How should we sample terms?

Best distribution \(=\)
\[
g(x) = [g(1),\ \ldots,\ g(n)]
\]
\[
g(i)\ \propto\ a_i\, \|v_i\|_2 \qquad [\text{Exercise}]
\]

---

## Page 9

\(a_i\) computation will need entire KV Cache reading.

→ What is a good \(g(x)\)? **[Think]** that is cheaply computable

we will answer this question partially in the Seminar and hopefully in some future class.

---
