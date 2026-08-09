# ---------------------------------------------------------------------------
# Bootstrap — ArgoCD + Cluster Autoscaler on the EKS cluster.
# The app itself is delivered via the existing ArgoCD manifests (argocd/).
# ---------------------------------------------------------------------------

resource "kubernetes_namespace" "argocd" {
  metadata {
    name = "argocd"
  }
}

resource "helm_release" "argocd" {
  name       = "argo-cd"
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"
  version    = "~> 7.0"
  namespace  = kubernetes_namespace.argocd.metadata[0].name
  create_namespace = false

  depends_on = [kubernetes_namespace.argocd]
}

resource "kubernetes_namespace" "ecommerce" {
  metadata {
    name = var.environment == "production" ? "ecommerce-production" : "ecommerce-staging"
  }
}

# Point ArgoCD at the app repo (path argocd/application.yml in the repo)
resource "kubernetes_manifest" "argocd_application" {
  depends_on = [helm_release.argocd, kubernetes_namespace.ecommerce]

  manifest = {
    apiVersion = "argoproj.io/v1alpha1"
    kind       = "Application"
    metadata = {
      name      = "skyline-ecommerce-${var.environment}"
      namespace = "argocd"
    }
    spec = {
      project = "default"
      source = {
        repoURL        = "https://github.com/rajdeepsadhu/skyline-shop-commerceos-microservices.git"
        targetRevision = "main"
        path           = var.environment == "production" ? "k8s/overlays/production" : "k8s/overlays/staging"
      }
      destination = {
        server    = "https://kubernetes.default.svc"
        namespace = kubernetes_namespace.ecommerce.metadata[0].name
      }
      syncPolicy = {
        automated = {
          prune    = true
          selfHeal = true
        }
      }
    }
  }
}

# --- Cluster Autoscaler (IRSA) ----------------------------------------------
resource "helm_release" "cluster_autoscaler" {
  count = var.enable_cluster_autoscaler ? 1 : 0

  name       = "cluster-autoscaler"
  repository = "https://kubernetes.github.io/autoscaler"
  chart      = "cluster-autoscaler"
  version    = "~> 9.0"
  namespace  = "kube-system"

  set {
    name  = "autoDiscovery.clusterName"
    value = module.eks.cluster_name
  }
  set {
    name  = "awsRegion"
    value = var.aws_region
  }
  set {
    name  = "rbac.serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn"
    value = aws_iam_role.cluster_autoscaler.arn
  }
  set {
    name  = "rbac.serviceAccount.name"
    value = "cluster-autoscaler"
  }
}
