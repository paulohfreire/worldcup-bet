#!/bin/bash

# GitHub CLI Wrapper para Git Bash/MinTTY no Windows
# Resolve problemas de interação com terminal

# Verifica se winpty está disponível
if command -v winpty &> /dev/null; then
    # Usa winpty para executar gh se disponível
    winpty gh "$@"
else
    # Usa gh normalmente se winpty não estiver disponível
    gh "$@"
fi
