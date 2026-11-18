from .development import *  # noqa: F403

# Somente para gerar arquivos estáticos da imagem; nunca usar para servir produção.
DEBUG = False
STORAGES['staticfiles']['BACKEND'] = 'whitenoise.storage.CompressedManifestStaticFilesStorage'  # noqa: F405
