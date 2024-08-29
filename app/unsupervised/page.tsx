import Link from 'next/link';

export default function Page() {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">Unsupervised Learning Models</h1>

      <p>
        This section aims to illustrate K-Means Clustering and PCA in
        unsupervised learning models.
      </p>
      <p>
        This shows the precision, recall and accuracy of the models. <br />
        It also shows prediction results for each model.
      </p>
      <p>
        As we have learned in our chapter on unsupervised learning, we can use
        PCA to reduce the dimensionality of our data and K-Means Clustering to
        group similar data points together.
      </p>

      <p>For this playground we will use a seeds dataset. </p>
      <Link href="https://archive.ics.uci.edu/dataset/236/seeds">
        Seeds dataset{' '}
      </Link>
      <p>
        The dataset contains 210 samples of wheat seeds. There are 7 features
        for each sample.
      </p>
      <p>
        The examined group comprised kernels belonging to three different
        varieties of wheat: Kama, Rosa and Canadian, 70 elements each, randomly
        selected for the experiment.
      </p>

      <p>
        We created some models using KMeans only and KMeans with PCA. We created
        a jupyter notebook with explicit explanations throughout the codebase to
        help you understand and try out (hands-on) creating unsupervised
        learning models with KMeans and PCA. You can access the jupyter notebook
        pdf below.
      </p>
      <p>
        <Link href="/files/unsupervised-learning/K-Means-clustering-and-PCA-predictions-by-retzam-ai.pdf">
          Unsupervised learning models
        </Link>
      </p>
    </div>
  );
}
